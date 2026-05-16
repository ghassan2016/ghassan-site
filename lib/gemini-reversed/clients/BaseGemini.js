const crypto = require("crypto");
const {
  Endpoint,
  Headers,
  Models,
  GRPC,
  AccountStatus,
  accountStatusFromCode,
  DEFAULT_METADATA,
} = require("../constants");
const {
  AuthError,
  APIError,
  GeminiError,
  TimeoutError,
} = require("../exceptions");
const {
  getNestedValue,
  extractJsonFromResponse,
} = require("../http/parsing");
const {buildGeminiPostHeaders} = require("../http/headers");
const {CookieJar} = require("../auth/CookieJar");
const {fetchAccessToken} = require("../session/accessToken");
const {rotate1PSIDTS} = require("../session/rotate");
const {AvailableModel} = require("../types/AvailableModel");
const {Gem, GemJar} = require("../types/Gem");
const {ChatTurn, ChatHistory, ChatInfo} = require("../types/ChatHistory");
const {RPCData} = require("../types/RPCData");
const {Candidate} = require("../types/Candidate");
const {ModelOutput} = require("../types/ModelOutput");
const {uploadFile, parseFileName} = require("../http/upload");
const {
  buildInnerRequest,
  parseCandidate,
  resolveModel,
  buildGenerateFormBody,
  iterateStream,
} = require("./generation");
const {
  extractDeepResearchStatusPayload,
} = require("./research_extract");
const {
  DeepResearchStatus,
  DeepResearchResult,
} = require("../types/Research");

const DEFAULT_TIMEOUT_MS = 450_000;
const DEFAULT_REFRESH_INTERVAL_MS = 600_000;

class BaseGemini {
  constructor({proxy = null, verbose = false} = {}) {
    if (new.target === BaseGemini) {
      throw new Error(
        "BaseGemini is abstract — instantiate AnonGemini or AuthGemini"
      );
    }
    this.proxy = proxy;
    this.verbose = verbose;
    this.accessToken = null;
    this.buildLabel = null;
    this.sessionId = null;
    this.language = "en";
    this.pushId = "feeds/mcudyrk2a4khkz";
    this.accountStatus = AccountStatus.AVAILABLE;
    this.timeout = DEFAULT_TIMEOUT_MS;
    this.autoClose = false;
    this.closeDelay = DEFAULT_TIMEOUT_MS;
    this.autoRefresh = true;
    this.refreshInterval = DEFAULT_REFRESH_INTERVAL_MS;
    this._running = false;
    this._cookies = new CookieJar();
    this._reqid = randomReqId();
    this._modelRegistry = {};
    this._recentChats = null;
    this._gems = null;
    this._refreshTimer = null;
    this._closeTimer = null;
    this._initLock = null;
  }

  get cookies() {
    return this._cookies;
  }

  async _prepareCookies() {
    return this._cookies;
  }

  async init({
    timeout = DEFAULT_TIMEOUT_MS,
    autoClose = false,
    closeDelay = DEFAULT_TIMEOUT_MS,
    autoRefresh = true,
    refreshInterval = DEFAULT_REFRESH_INTERVAL_MS,
    verbose = this.verbose,
  } = {}) {
    if (this._initLock) return this._initLock;
    this._initLock = (async () => {
      try {
        if (this._running) return;
        this.verbose = verbose;
        this.timeout = timeout;
        this.autoClose = autoClose;
        this.closeDelay = closeDelay;
        this.autoRefresh = autoRefresh;
        this.refreshInterval = refreshInterval;

        await this._prepareCookies();
        const session = await fetchAccessToken({
          cookies: this._cookies,
          verbose: this.verbose,
        });
        this.accessToken = session.accessToken;
        this.buildLabel = session.buildLabel;
        this.sessionId = session.sessionId;
        this.language = session.language || "en";
        this.pushId = session.pushId || this.pushId;
        this._running = true;
        this._reqid = randomReqId();

        if (this.autoClose) this._resetCloseTimer();
        if (this.autoRefresh) this._startAutoRefresh();

        await this._initRpc();
        if (this.verbose) {
          console.log("[gemini] client initialized");
        }
      } catch (err) {
        await this.close().catch(() => {});
        throw err;
      } finally {
        this._initLock = null;
      }
    })();
    return this._initLock;
  }

  async close({delay = 0} = {}) {
    if (delay) await sleep(delay);
    this._running = false;
    if (this._refreshTimer) {
      clearInterval(this._refreshTimer);
      this._refreshTimer = null;
    }
    if (this._closeTimer) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
  }

  _resetCloseTimer() {
    if (this._closeTimer) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
    if (!this.autoClose) return;
    this._closeTimer = setTimeout(() => {
      this.close().catch(() => {});
    }, this.closeDelay);
    this._closeTimer.unref?.();
  }

  _startAutoRefresh() {
    if (this._refreshTimer) clearInterval(this._refreshTimer);
    const interval = Math.max(this.refreshInterval, 60_000);
    this._refreshTimer = setInterval(() => {
      if (!this._running) return;
      rotate1PSIDTS({cookies: this._cookies, verbose: this.verbose}).catch(
        (err) => {
          if (err instanceof AuthError) {
            console.warn(
              "[gemini] auto-refresh detected expired __Secure-1PSID; subsequent calls will fail until cookies are refreshed."
            );
          } else if (this.verbose) {
            console.warn(`[gemini] auto-refresh failed: ${err.message}`);
          }
        }
      );
    }, interval);
    this._refreshTimer.unref?.();
  }

  async _ensureRunning() {
    if (!this._running) await this.init();
    if (!this._running) {
      throw new APIError("Gemini client failed to initialize");
    }
    if (this.autoClose) this._resetCloseTimer();
  }

  async _initRpc() {
    await this._fetchUserStatus();
    await this._sendBardSettings();
    await this._sendBardActivity();
    await this._fetchRecentChats();
  }

  async _fetchUserStatus() {
    const response = await this._batchExecute([
      new RPCData({rpcid: GRPC.GET_USER_STATUS, payload: "[]"}),
    ]);
    const text = await response.text();
    const parts = extractJsonFromResponse(text);
    for (const part of parts) {
      const bodyStr = getNestedValue(part, [2]);
      if (!bodyStr) continue;
      let body;
      try {
        body = JSON.parse(bodyStr);
      } catch {
        continue;
      }
      const statusCode = getNestedValue(body, [14]);
      this.accountStatus = accountStatusFromCode(statusCode);
      const hardBlock = [
        "LOCATION_REJECTED",
        "ACCOUNT_REJECTED",
        "ACCESS_TEMPORARILY_UNAVAILABLE",
        "ACCOUNT_REJECTED_BY_GUARDIAN",
        "GUARDIAN_APPROVAL_REQUIRED",
      ].includes(this.accountStatus.name);

      if (this.verbose) {
        console.log(
          `[gemini] account status: ${this.accountStatus.name} - ${this.accountStatus.description}`
        );
      }
      if (hardBlock) continue;

      const modelsList = getNestedValue(body, [15]);
      if (!Array.isArray(modelsList)) continue;
      const tierFlags = getNestedValue(body, [16], []) || [];
      const capabilityFlags = getNestedValue(body, [17], []) || [];
      const [capacity, capacityField] = AvailableModel.computeCapacity(
        Array.isArray(tierFlags) ? tierFlags : [],
        Array.isArray(capabilityFlags) ? capabilityFlags : []
      );
      const idNameMapping = AvailableModel.buildModelIdNameMapping();

      for (const modelData of modelsList) {
        if (!Array.isArray(modelData)) continue;
        const modelId = getNestedValue(modelData, [0], "");
        const displayName = getNestedValue(modelData, [1], "");
        const description = getNestedValue(modelData, [2], "");
        if (!modelId || !displayName) continue;
        const isAvailable =
          this.accountStatus.name !== "UNAUTHENTICATED" ||
          modelId === "fbb127bbb056c959";
        this._modelRegistry[modelId] = new AvailableModel({
          modelId,
          modelName: idNameMapping[modelId] || "",
          displayName,
          description,
          capacity,
          capacityField,
          isAvailable,
        });
      }
      return;
    }
  }

  async _sendBardSettings() {
    await this._batchExecute([
      new RPCData({
        rpcid: GRPC.BARD_SETTINGS,
        payload:
          '[[["adaptive_device_responses_enabled","ai_transparency_notice_dismissed","bard_in_chrome_link_sharing_enabled","enable_token_streaming","enable_advanced_mode","enable_memory","enable_personal_context","enable_personal_context_search","enable_personal_context_youtube","has_received_streaming_response","is_imported_chats_panel_open_by_default","side_nav_open_by_default","web_and_app_activity_enabled"]]]',
      }),
    ]);
  }

  async _sendBardActivity() {
    await this._batchExecute([
      new RPCData({
        rpcid: GRPC.BARD_SETTINGS,
        payload: '[[["bard_activity_enabled"]]]',
      }),
    ]);
  }

  listModels() {
    const values = Object.values(this._modelRegistry);
    return values.length ? values : null;
  }

  async generateContent(prompt, options = {}) {
    if (!prompt) throw new Error("Prompt cannot be empty");
    await this._ensureRunning();
    if (this.autoClose) this._resetCloseTimer();

    let fileData = null;
    if (options.files && options.files.length) {
      await this._sendBardActivity();
      fileData = await this._uploadAllFiles(options.files);
    }

    const sessionState = {lastTexts: {}, lastThoughts: {}};

    let final = null;
    for await (const out of this._generate({
      prompt,
      reqFileData: fileData,
      model: options.model,
      gem: options.gem,
      chat: options.chat,
      temporary: options.temporary === true,
      deepResearch: options.deepResearch === true,
      sessionState,
      onThinking: options.onThinking,
      onText: options.onText,
    })) {
      final = out;
    }
    if (!final) {
      throw new GeminiError(
        "Failed to generate contents. No output data found in response."
      );
    }
    if (options.chat && typeof options.chat === "object") {
      final.metadata = options.chat.metadata;
      options.chat.lastOutput = final;
    }
    return final;
  }

  async *generateContentStream(prompt, options = {}) {
    if (!prompt) throw new Error("Prompt cannot be empty");
    await this._ensureRunning();
    if (this.autoClose) this._resetCloseTimer();

    let fileData = null;
    if (options.files && options.files.length) {
      await this._sendBardActivity();
      fileData = await this._uploadAllFiles(options.files);
    }
    const sessionState = {lastTexts: {}, lastThoughts: {}};

    let final = null;
    for await (const out of this._generate({
      prompt,
      reqFileData: fileData,
      model: options.model,
      gem: options.gem,
      chat: options.chat,
      temporary: options.temporary === true,
      deepResearch: options.deepResearch === true,
      sessionState,
      onThinking: options.onThinking,
      onText: options.onText,
    })) {
      final = out;
      yield out;
    }
    if (final && options.chat && typeof options.chat === "object") {
      final.metadata = options.chat.metadata;
      options.chat.lastOutput = final;
    }
  }

  async _uploadAllFiles(files) {
    const cookieHeader = this._cookies.toHeader();
    const uploads = await Promise.all(
      files.map((file) =>
        uploadFile({
          file,
          cookieHeader: cookieHeader || null,
          pushId: this.pushId,
        })
      )
    );
    return uploads.map((url, i) => [[url], parseFileName(files[i])]);
  }

  async *_generate({
    prompt,
    reqFileData,
    model,
    gem,
    chat,
    temporary,
    deepResearch,
    sessionState,
    onThinking,
    onText,
  }) {
    const resolved = resolveModel(model || Models.UNSPECIFIED, this._modelRegistry);
    const modelName = resolved.modelName || "unspecified";
    const modelHeader = resolved.modelHeader || {};
    const gemId = gem instanceof Gem ? gem.id : gem || null;

    const _reqid = this._reqid;
    this._reqid += 100_000;

    const innerRequest = buildInnerRequest({
      prompt,
      reqFileData,
      language: this.language || "en",
      metadata: chat?.metadata,
      gemId,
      temporary,
      deepResearch,
    });
    const uuidVal = crypto.randomUUID().toUpperCase();
    innerRequest[59] = uuidVal;

    const params = new URLSearchParams({
      hl: this.language || "en",
      _reqid: String(_reqid),
      rt: "c",
    });
    if (this.buildLabel) params.set("bl", this.buildLabel);
    if (this.sessionId) params.set("f.sid", this.sessionId);

    const headers = buildGeminiPostHeaders({
      cookieHeader: this._cookies.toHeader() || undefined,
      extra: {
        ...modelHeader,
        "x-goog-ext-525005358-jspb": `["${uuidVal}",1]`,
      },
    });

    const body = buildGenerateFormBody({
      accessToken: this.accessToken,
      innerRequest,
    });
    const url = `${Endpoint.GENERATE}?${params.toString()}`;

    const controller = new AbortController();
    const timer = this.timeout
      ? setTimeout(() => controller.abort(), this.timeout + 5_000)
      : null;
    timer?.unref?.();

    let response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers,
        body,
        signal: controller.signal,
      });
    } catch (err) {
      if (timer) clearTimeout(timer);
      if (err?.name === "AbortError") {
        throw new TimeoutError(
          "Gemini generate request aborted before response arrived. Increase `timeout` or check the network."
        );
      }
      throw err;
    }

    if (!response.ok) {
      if (timer) clearTimeout(timer);
      await this.close().catch(() => {});
      throw new APIError(
        `Failed to generate contents. Status: ${response.status}`
      );
    }
    if (!response.body) {
      if (timer) clearTimeout(timer);
      throw new APIError("Failed to receive response body");
    }

    try {
      yield* iterateStream({
        response,
        chat,
        modelName,
        sessionState,
        deepResearch,
        clientRef: this,
        recentChats: this._recentChats,
        closeOnError: () => this.close().catch(() => {}),
        verbose: this.verbose,
        onThinking,
        onText,
      });
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  async _batchExecute(payloads, {sourcePath = "/app", closeOnError = true, ensureRunning = true} = {}) {
    if (ensureRunning) await this._ensureRunning();
    const _reqid = this._reqid;
    this._reqid += 100_000;
    const params = new URLSearchParams({
      rpcids: payloads.map((p) => p.rpcid).join(","),
      hl: this.language || "en",
      _reqid: String(_reqid),
      rt: "c",
      "source-path": sourcePath,
    });
    if (this.buildLabel) params.set("bl", this.buildLabel);
    if (this.sessionId) params.set("f.sid", this.sessionId);

    const headers = buildGeminiPostHeaders({
      cookieHeader: this._cookies.toHeader() || undefined,
      extra: {...Headers.BATCH_EXEC},
    });

    const body = new URLSearchParams({
      at: this.accessToken || "",
      "f.req": JSON.stringify([payloads.map((p) => p.serialize())]),
    });

    const url = `${Endpoint.BATCH_EXEC}?${params.toString()}`;
    const response = await fetch(url, {method: "POST", headers, body});
    if (this.verbose) {
      console.log(`[gemini] POST ${Endpoint.BATCH_EXEC} → ${response.status}`);
    }
    if (!response.ok) {
      if (closeOnError) await this.close().catch(() => {});
      throw new APIError(
        `Batch execution failed with status code ${response.status}`
      );
    }
    return response;
  }

  async _fetchRecentChats(recent = 13) {
    const responses = await Promise.all([
      this._batchExecute([
        new RPCData({
          rpcid: GRPC.LIST_CHATS,
          payload: JSON.stringify([recent, null, [1, null, 1]]),
        }),
      ]),
      this._batchExecute([
        new RPCData({
          rpcid: GRPC.LIST_CHATS,
          payload: JSON.stringify([recent, null, [0, null, 1]]),
        }),
      ]),
    ]).catch((err) => {
      if (this.verbose) {
        console.warn(`[gemini] _fetchRecentChats failed: ${err.message}`);
      }
      return null;
    });
    if (!responses) {
      this._recentChats = [];
      return;
    }
    const recentChats = [];
    for (const resp of responses) {
      const text = await resp.text();
      const parts = extractJsonFromResponse(text);
      for (const part of parts) {
        const bodyStr = getNestedValue(part, [2]);
        if (!bodyStr) continue;
        let body;
        try {
          body = JSON.parse(bodyStr);
        } catch {
          continue;
        }
        const chatList = getNestedValue(body, [2]);
        if (!Array.isArray(chatList)) continue;
        for (const chatData of chatList) {
          if (!Array.isArray(chatData) || chatData.length < 2) continue;
          const cid = getNestedValue(chatData, [0], "");
          const title = getNestedValue(chatData, [1], "");
          const isPinned = !!getNestedValue(chatData, [2]);
          const tsData = getNestedValue(chatData, [5]);
          let timestamp = 0;
          if (Array.isArray(tsData) && tsData.length >= 2) {
            timestamp = Number(tsData[0]) + Number(tsData[1]) / 1e9;
          }
          if (cid && !recentChats.some((c) => c.cid === cid)) {
            recentChats.push(new ChatInfo({cid, title, isPinned, timestamp}));
          }
        }
        break;
      }
    }
    this._recentChats = recentChats;
  }

  listChats() {
    return this._recentChats;
  }

  async readChat(cid, {limit = 10} = {}) {
    try {
      const response = await this._batchExecute([
        new RPCData({
          rpcid: GRPC.READ_CHAT,
          payload: JSON.stringify([cid, limit, null, 1, [1], [4], null, 1]),
        }),
      ]);
      const text = await response.text();
      const parts = extractJsonFromResponse(text);
      for (const part of parts) {
        const bodyStr = getNestedValue(part, [2]);
        if (!bodyStr) continue;
        const body = JSON.parse(bodyStr);
        const turnsData = getNestedValue(body, [0]);
        if (!turnsData) continue;
        const chatTurns = [];
        for (const convTurn of turnsData) {
          const rid = getNestedValue(convTurn, [0, 1], "");
          const candidatesList = getNestedValue(convTurn, [3, 0]);
          if (Array.isArray(candidatesList) && candidatesList.length) {
            const outputCandidates = [];
            for (const candidateData of candidatesList) {
              const completionStatus = getNestedValue(candidateData, [8, 0]);
              const hasProgress =
                getNestedValue(candidateData, [12, 6, 0]) !== null &&
                getNestedValue(candidateData, [12, 6, 0]) !== undefined;
              if (completionStatus !== 2 && hasProgress) {
                return null;
              }
              const rcid = getNestedValue(candidateData, [0]);
              if (!rcid) continue;
              const parsed = parseCandidate({
                candidateData,
                cid,
                rid,
                rcid,
                clientRef: this,
              });
              outputCandidates.push(
                new Candidate({
                  rcid,
                  text: parsed.text,
                  textDelta: parsed.text,
                  thoughts: parsed.thoughts || null,
                  thoughtsDelta: parsed.thoughts || null,
                  webImages: parsed.webImages,
                  generatedImages: parsed.generatedImages,
                  generatedVideos: parsed.generatedVideos,
                  generatedMedia: parsed.generatedMedia,
                })
              );
            }
            if (outputCandidates.length) {
              const modelOutput = new ModelOutput({
                metadata: [cid, rid],
                candidates: outputCandidates,
              });
              chatTurns.push(
                new ChatTurn({
                  role: "model",
                  text: modelOutput.text,
                  modelOutput,
                })
              );
            }
          }
          const userText = getNestedValue(convTurn, [2, 0, 0], "");
          if (userText) chatTurns.push(new ChatTurn({role: "user", text: userText}));
        }
        return new ChatHistory({cid, turns: chatTurns});
      }
      return null;
    } catch (err) {
      if (this.verbose) {
        console.warn(`[gemini] readChat(${cid}) failed: ${err.message}`);
      }
      return null;
    }
  }

  async fetchLatestChatResponse(cid) {
    const history = await this.readChat(cid, {limit: 5});
    if (!history || !history.turns || history.turns.length === 0) return null;
    for (const turn of history.turns) {
      if (turn.role === "model" && turn.modelOutput) return turn.modelOutput;
    }
    return null;
  }

  async deleteChat(cid) {
    await this._batchExecute([
      new RPCData({rpcid: GRPC.DELETE_CHAT_1, payload: JSON.stringify([cid])}),
    ]);
    await this._batchExecute([
      new RPCData({
        rpcid: GRPC.DELETE_CHAT_2,
        payload: JSON.stringify([cid, [1, null, 0, 1]]),
      }),
    ]);
  }

  get gems() {
    if (!this._gems) {
      throw new Error("Gems not fetched yet. Call `fetchGems()` first.");
    }
    return this._gems;
  }

  async fetchGems({includeHidden = false} = {}) {
    const response = await this._batchExecute([
      new RPCData({
        rpcid: GRPC.LIST_GEMS,
        payload: includeHidden
          ? `[4,['${this.language || "en"}'],0]`
          : `[3,['${this.language || "en"}'],0]`,
        identifier: "system",
      }),
      new RPCData({
        rpcid: GRPC.LIST_GEMS,
        payload: `[2,['${this.language || "en"}'],0]`,
        identifier: "custom",
      }),
    ]);
    const text = await response.text();
    let predefined = [];
    let custom = [];
    try {
      const parts = extractJsonFromResponse(text);
      for (const part of parts) {
        const identifier = getNestedValue(part, [-1]);
        const bodyStr = getNestedValue(part, [2]);
        if (!bodyStr) continue;
        const body = JSON.parse(bodyStr);
        if (identifier === "system") predefined = getNestedValue(body, [2], []) || [];
        else if (identifier === "custom") custom = getNestedValue(body, [2], []) || [];
      }
    } catch (err) {
      await this.close().catch(() => {});
      throw new APIError("Failed to fetch gems. Unexpected response data structure.");
    }
    if (!predefined.length && !custom.length) {
      await this.close().catch(() => {});
      throw new APIError("Failed to fetch gems. Unexpected response data structure.");
    }
    const jar = new GemJar();
    for (const gemEntry of predefined) {
      jar.set(
        gemEntry[0],
        new Gem({
          id: gemEntry[0],
          name: gemEntry[1][0],
          description: gemEntry[1][1],
          prompt: gemEntry[2] && gemEntry[2][0],
          predefined: true,
        })
      );
    }
    for (const gemEntry of custom) {
      jar.set(
        gemEntry[0],
        new Gem({
          id: gemEntry[0],
          name: gemEntry[1][0],
          description: gemEntry[1][1],
          prompt: gemEntry[2] && gemEntry[2][0],
          predefined: false,
        })
      );
    }
    this._gems = jar;
    return jar;
  }

  async createGem(name, prompt, description = "") {
    const response = await this._batchExecute([
      new RPCData({
        rpcid: GRPC.CREATE_GEM,
        payload: JSON.stringify([
          [name, description, prompt, null, null, null, null, null, 0, null, 1, null, null, null, []],
        ]),
      }),
    ]);
    const text = await response.text();
    const parts = extractJsonFromResponse(text);
    const bodyStr = getNestedValue(parts, [0, 2]);
    if (!bodyStr) {
      await this.close().catch(() => {});
      throw new APIError("Failed to create gem. Unexpected response data structure.");
    }
    const body = JSON.parse(bodyStr);
    const gemId = getNestedValue(body, [0]);
    if (!gemId) {
      await this.close().catch(() => {});
      throw new APIError("Failed to create gem. Unexpected response data structure.");
    }
    return new Gem({id: gemId, name, description, prompt, predefined: false});
  }

  async updateGem(gemOrId, name, prompt, description = "") {
    const gemId = gemOrId instanceof Gem ? gemOrId.id : gemOrId;
    await this._batchExecute([
      new RPCData({
        rpcid: GRPC.UPDATE_GEM,
        payload: JSON.stringify([
          gemId,
          [name, description, prompt, null, null, null, null, null, 0, null, 1, null, null, null, [], 0],
        ]),
      }),
    ]);
    return new Gem({id: gemId, name, description, prompt, predefined: false});
  }

  async deleteGem(gemOrId) {
    const gemId = gemOrId instanceof Gem ? gemOrId.id : gemOrId;
    await this._batchExecute([
      new RPCData({rpcid: GRPC.DELETE_GEM, payload: JSON.stringify([gemId])}),
    ]);
  }

  async _getFullSizeImage({cid, rid, rcid, imageId}) {
    try {
      const payload = [
        [
          [null, null, null, [null, null, null, null, null, ""]],
          [imageId, 0],
          null,
          [19, ""],
          null,
          null,
          null,
          null,
          null,
          "",
        ],
        [rid, rcid, cid, null, ""],
        1,
        0,
        1,
      ];
      const response = await this._batchExecute([
        new RPCData({
          rpcid: GRPC.GET_FULL_SIZE_IMAGE,
          payload: JSON.stringify(payload),
        }),
      ]);
      const text = await response.text();
      const data = extractJsonFromResponse(text);
      const bodyStr = getNestedValue(data, [0, 2], "[]");
      const body = JSON.parse(bodyStr);
      return getNestedValue(body, [0]);
    } catch (err) {
      if (this.verbose) {
        console.warn(`[gemini] _getFullSizeImage failed: ${err.message}`);
      }
      return null;
    }
  }

  startChat(options = {}) {
    return new ChatSession({client: this, ...options});
  }
}

class ChatSession {
  constructor({
    client,
    metadata = null,
    cid = "",
    rid = "",
    rcid = "",
    model = null,
    gem = null,
  }) {
    if (!client) throw new Error("ChatSession: `client` is required");
    this.client = client;
    this.lastOutput = null;
    this.model = model;
    this.gem = gem;
    this._metadata = DEFAULT_METADATA.slice();
    if (metadata) this.metadata = metadata;
    if (cid) this.cid = cid;
    if (rid) this.rid = rid;
    if (rcid) this.rcid = rcid;
  }

  get metadata() {
    return this._metadata;
  }

  set metadata(value) {
    if (!Array.isArray(value)) return;
    for (let i = 0; i < value.length && i < 10; i += 1) {
      if (value[i] !== null && value[i] !== undefined) this._metadata[i] = value[i];
    }
  }

  get cid() {
    return this._metadata[0];
  }
  set cid(value) {
    this._metadata[0] = value;
  }
  get rid() {
    return this._metadata[1];
  }
  set rid(value) {
    this._metadata[1] = value;
  }
  get rcid() {
    return this._metadata[2];
  }
  set rcid(value) {
    this._metadata[2] = value;
  }

  async sendMessage(prompt, options = {}) {
    return this.client.generateContent(prompt, {
      ...options,
      model: options.model ?? this.model,
      gem: options.gem ?? this.gem,
      chat: this,
    });
  }

  async *sendMessageStream(prompt, options = {}) {
    yield* this.client.generateContentStream(prompt, {
      ...options,
      model: options.model ?? this.model,
      gem: options.gem ?? this.gem,
      chat: this,
    });
  }

  chooseCandidate(index) {
    if (!this.lastOutput) {
      throw new Error("No previous output data found in this chat session.");
    }
    if (index >= this.lastOutput.candidates.length) {
      throw new Error(
        `Index ${index} exceeds the number of candidates in last model output.`
      );
    }
    this.lastOutput.chosen = index;
    this.rcid = this.lastOutput.rcid;
    return this.lastOutput;
  }

  async readHistory({limit = 10} = {}) {
    if (!this.cid) return null;
    return this.client.readChat(this.cid, {limit});
  }
}

function randomReqId() {
  return Math.floor(10000 + Math.random() * 90000);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {BaseGemini, ChatSession};
