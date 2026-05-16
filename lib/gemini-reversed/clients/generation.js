const crypto = require("crypto");
const {
  STREAMING_FLAG_INDEX,
  GEM_FLAG_INDEX,
  TEMPORARY_CHAT_FLAG_INDEX,
  DEFAULT_METADATA,
  CARD_CONTENT_RE,
  ARTIFACTS_RE,
  ErrorCode,
} = require("../constants");
const {
  APIError,
  ModelInvalid,
  TemporarilyBlocked,
  UsageLimitExceeded,
} = require("../exceptions");
const {
  parseResponseByFrame,
  getNestedValue,
  getDeltaByFpLen,
} = require("../http/parsing");
const {Candidate} = require("../types/Candidate");
const {ModelOutput} = require("../types/ModelOutput");
const {WebImage, GeneratedImage} = require("../types/Image");
const {GeneratedVideo, GeneratedMedia} = require("../types/Video");
const {extractDeepResearchPlan} = require("./research_extract");

function buildInnerRequest({
  prompt,
  reqFileData,
  language,
  metadata,
  gemId,
  temporary,
  deepResearch,
}) {
  const messageContent = [prompt, 0, null, reqFileData, null, null, 0];

  const inner = new Array(69).fill(null);
  inner[0] = messageContent;
  inner[1] = [language];
  inner[2] = metadata && metadata.length ? metadata : DEFAULT_METADATA.slice();

  if (deepResearch) {
    inner[3] = "!" + crypto.randomBytes(2600).toString("base64url").slice(0, 2600);
    inner[4] = crypto.randomUUID().replace(/-/g, "");
  }
  inner[6] = [1];
  inner[STREAMING_FLAG_INDEX] = 1;
  inner[10] = 1;
  inner[11] = 0;
  inner[17] = [[0]];
  inner[18] = 0;
  if (gemId) inner[GEM_FLAG_INDEX] = gemId;
  inner[27] = 1;
  inner[30] = [4];
  inner[41] = [1];
  if (temporary) inner[TEMPORARY_CHAT_FLAG_INDEX] = 1;
  if (deepResearch) {
    inner[49] = 1;
    inner[54] = [[[[[1]]]]];
    inner[55] = [[1]];
  }
  inner[53] = 0;
  inner[61] = [];
  inner[68] = 2;
  return inner;
}

function cleanCandidateText(rawText, candidateData) {
  let text = rawText || "";
  if (CARD_CONTENT_RE.test(text)) {
    text = getNestedValue(candidateData, [22, 0]) || text;
  }
  return text.replace(ARTIFACTS_RE, "");
}

function parseCandidate({candidateData, cid, rid, rcid, clientRef}) {
  const rawText = getNestedValue(candidateData, [1, 0], "");
  const text = cleanCandidateText(rawText, candidateData);
  const thoughts = getNestedValue(candidateData, [37, 0, 0]) || "";

  const webImages = [];
  const webImagesData = getNestedValue(candidateData, [12, 1], []);
  if (Array.isArray(webImagesData)) {
    webImagesData.forEach((webImg, i) => {
      const url = getNestedValue(webImg, [0, 0, 0]);
      if (url) {
        webImages.push(
          new WebImage({
            url,
            title: `[Image ${i + 1}]`,
            alt: getNestedValue(webImg, [0, 4], ""),
            proxy: clientRef?.proxy || null,
            clientRef,
          })
        );
      }
    });
  }

  const generatedImages = [];
  const plainGen = getNestedValue(candidateData, [12, 7, 0], []) || [];
  const i2iGen = getNestedValue(candidateData, [12, 0, "8", 0], []) || [];
  const allGen = [...plainGen, ...i2iGen];
  allGen.forEach((genImg, i) => {
    const url = getNestedValue(genImg, [0, 3, 3]);
    if (!url) return;
    let imageId = getNestedValue(genImg, [1, 0]);
    if (!imageId) {
      imageId = `http://googleusercontent.com/image_generation_content/${i}`;
    }
    generatedImages.push(
      new GeneratedImage({
        url,
        title: `[Generated Image ${i}]`,
        alt: getNestedValue(genImg, [0, 3, 2], ""),
        proxy: clientRef?.proxy || null,
        clientRef,
        cid,
        rid,
        rcid,
        imageId,
      })
    );
  });

  const generatedVideos = [];
  let videoInfo = getNestedValue(candidateData, [12, 0, "60", 0, 0, 0], null);
  if (!videoInfo || (Array.isArray(videoInfo) && videoInfo.length === 0)) {
    videoInfo = getNestedValue(candidateData, [12, 59, 0, 0, 0], []);
  }
  if (Array.isArray(videoInfo) && videoInfo.length) {
    const urls = getNestedValue(videoInfo, [0, 7], []);
    if (Array.isArray(urls) && urls.length >= 2) {
      generatedVideos.push(
        new GeneratedVideo({
          url: urls[1],
          thumbnail: urls[0],
          cid,
          rid,
          rcid,
          clientRef,
          proxy: clientRef?.proxy || null,
        })
      );
    }
  }

  const generatedMedia = [];
  const mediaData =
    getNestedValue(candidateData, [12, 0, "87"], null) ||
    getNestedValue(candidateData, [12, 86], []);
  if (Array.isArray(mediaData) && mediaData.length) {
    let mp3Url = "";
    let mp3Thumb = "";
    const mp3List = getNestedValue(mediaData, [0, 1, 7], []);
    if (Array.isArray(mp3List) && mp3List.length >= 2) {
      mp3Thumb = mp3List[0];
      mp3Url = mp3List[1];
    }
    let mp4Url = "";
    let mp4Thumb = "";
    const mp4List = getNestedValue(mediaData, [1, 1, 7], []);
    if (Array.isArray(mp4List) && mp4List.length >= 2) {
      mp4Thumb = mp4List[0];
      mp4Url = mp4List[1];
    }
    if (mp3Url || mp4Url) {
      generatedMedia.push(
        new GeneratedMedia({
          url: mp4Url,
          thumbnail: mp4Thumb,
          mp3Url,
          mp3Thumbnail: mp3Thumb,
          cid,
          rid,
          rcid,
          clientRef,
          proxy: clientRef?.proxy || null,
        })
      );
    }
  }

  return {text, thoughts, webImages, generatedImages, generatedVideos, generatedMedia};
}

function resolveModel(model, registry) {
  if (!model) return null;
  if (typeof model === "string") {
    if (registry && registry[model]) return registry[model];
    if (registry) {
      for (const m of Object.values(registry)) {
        if (m.modelName === model || m.displayName === model) return m;
      }
    }
    const {modelFromName} = require("../constants");
    return modelFromName(model);
  }
  if (model && typeof model === "object") {
    if (model.modelHeader) return model;
    if (model.modelName && model.modelHeader) return model;
    const {modelFromDict} = require("../constants");
    return modelFromDict(model);
  }
  throw new TypeError(`Unsupported model type: ${typeof model}`);
}

function errorForCode(code, modelName) {
  switch (code) {
    case ErrorCode.USAGE_LIMIT_EXCEEDED:
      return new UsageLimitExceeded(
        `Usage limit exceeded for model '${modelName}'. Wait a few minutes, ` +
          "switch to another model (e.g. Gemini Flash), or check account limits."
      );
    case ErrorCode.MODEL_INCONSISTENT:
      return new ModelInvalid(
        "The specified model is inconsistent with the conversation history. " +
          "Use the same `model` parameter throughout the entire ChatSession."
      );
    case ErrorCode.MODEL_HEADER_INVALID:
      return new ModelInvalid(
        `Model '${modelName}' is currently unavailable or the request structure is outdated.`
      );
    case ErrorCode.IP_TEMPORARILY_BLOCKED:
      return new TemporarilyBlocked(
        "Your IP has been temporarily flagged or blocked by Google. " +
          "Try a proxy, a different network, or wait before retrying."
      );
    case ErrorCode.TEMPORARY_ERROR_1013:
      return new APIError("Gemini encountered a temporary error (1013). Retrying…");
    default:
      return null;
  }
}

function buildGenerateFormBody({accessToken, innerRequest}) {
  return new URLSearchParams({
    at: accessToken || "",
    "f.req": JSON.stringify([null, JSON.stringify(innerRequest)]),
  });
}

async function* iterateStream({
  response,
  chat,
  modelName,
  sessionState,
  deepResearch,
  clientRef,
  recentChats,
  closeOnError,
  verbose,
  onThinking,
  onText,
}) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let initialPrefixStripped = false;

  let isThinking = false;
  let isQueueing = false;
  let isCompleted = false;
  let isFinalChunk = false;
  let cid = chat?.cid || "";
  let rid = chat?.rid || "";
  let resolvedModel = null;
  let lastYielded = null;

  const {lastTexts, lastThoughts} = sessionState;
  const _captureMetadata = (mdata) => {
    const newCid = getNestedValue(mdata, [0]);
    const newRid = getNestedValue(mdata, [1]);
    if (newCid) cid = newCid;
    if (newRid) rid = newRid;
    if (chat) chat.metadata = mdata;
  };

  const fire = (cb, event) => {
    if (typeof cb !== "function") return;
    try {
      cb(event);
    } catch {
      /* swallow — callback errors must not abort the stream */
    }
  };

  const resolveModelIdToName = (modelId) => {
    if (!modelId) return null;
    if (clientRef?._modelRegistry) {
      const m = clientRef._modelRegistry[modelId];
      if (m) return m.modelName || m.displayName || null;
    }
    const {Models, MODEL_HEADER_KEY} = require("../constants");
    for (const member of Object.values(Models)) {
      const headerValue = member.modelHeader?.[MODEL_HEADER_KEY];
      if (!headerValue) continue;
      try {
        const parsed = JSON.parse(headerValue);
        if (parsed[4] === modelId) return member.modelName;
      } catch {
        /* skip */
      }
    }
    return null;
  };

  async function* processParts(parts) {
    for (const part of parts) {
      const code = getNestedValue(part, [5, 2, 0, 1, 0]);
      if (code) {
        if (closeOnError) await closeOnError();
        const err = errorForCode(code, modelName);
        if (err) throw err;
        throw new APIError(
          `Failed to generate contents (stream). Unknown API error code: ${code}.`
        );
      }
      const status = getNestedValue(part, [5]);
      if (Array.isArray(status) && status.length && !isThinking) {
        isQueueing = true;
      }

      const inner = getNestedValue(part, [2]);
      if (!inner) continue;

      let body;
      try {
        body = JSON.parse(inner);
      } catch {
        continue;
      }

      const mData = getNestedValue(body, [1]);
      if (mData) _captureMetadata(mData);

      const modelIdSeen = getNestedValue(body, [39]);
      if (typeof modelIdSeen === "string" && modelIdSeen) {
        const name = resolveModelIdToName(modelIdSeen);
        resolvedModel = {modelId: modelIdSeen, modelName: name};
      }

      const toolName = getNestedValue(body, [6, 1, 0]);
      if (toolName === "data_analysis_tool") {
        isThinking = true;
        isQueueing = false;
      }

      const contextStr = getNestedValue(body, [25]);
      if (typeof contextStr === "string") {
        isFinalChunk = true;
        isThinking = false;
        isQueueing = false;
        if (chat) chat.metadata = new Array(9).fill(null).concat([contextStr]);
      }

      let timestamp = Date.now() / 1000;
      const tsData = getNestedValue(body, [27, 0, 0, 3]);
      if (Array.isArray(tsData) && tsData.length >= 2) {
        timestamp = Number(tsData[0]) + Number(tsData[1]) / 1e9;
      }

      const candidatesList = getNestedValue(body, [4], []);
      if (!Array.isArray(candidatesList) || candidatesList.length === 0) continue;

      const outputCandidates = [];
      for (let i = 0; i < candidatesList.length; i += 1) {
        const candidateData = candidatesList[i];
        const rcid = getNestedValue(candidateData, [0]);
        if (!rcid) continue;
        if (chat) chat.rcid = rcid;

        const {text, thoughts, webImages, generatedImages, generatedVideos, generatedMedia} =
          parseCandidate({candidateData, cid, rid, rcid, clientRef});

        let deepResearchPlan = null;
        if (deepResearch) {
          const planData = extractDeepResearchPlan(candidateData, text);
          if (planData) {
            const {DeepResearchPlan} = require("../types/Research");
            deepResearchPlan = new DeepResearchPlan({
              ...planData,
              cid: chat?.cid || planData.cid || null,
            });
          }
        }

        const indicator = getNestedValue(candidateData, [8, 0]);
        isCompleted = indicator === 2;
        const finalLike = isCompleted || indicator === null || indicator === undefined;

        if (isFinalChunk && cid && Array.isArray(recentChats)) {
          let title = `Chat(${cid})`;
          let isPinned = false;
          for (const c of recentChats) {
            if (c.cid === cid) {
              title = c.title;
              isPinned = c.isPinned;
              break;
            }
          }
          const expectedIdx = isPinned
            ? 0
            : recentChats.filter((c) => c.cid !== cid && c.isPinned).length;
          const existing = recentChats[expectedIdx];
          const sameAsExpected =
            existing &&
            existing.cid === cid &&
            existing.title === title &&
            existing.timestamp === timestamp;
          if (!sameAsExpected) {
            const idx = recentChats.findIndex((c) => c.cid === cid);
            if (idx >= 0) recentChats.splice(idx, 1);
            const {ChatInfo} = require("../types/ChatHistory");
            recentChats.splice(
              expectedIdx,
              0,
              new ChatInfo({cid, title, isPinned, timestamp})
            );
          }
        }

        const lastText = lastTexts[rcid] || lastTexts[`idx_${i}`] || "";
        const [textDelta, newFullText] = getDeltaByFpLen(text, lastText, finalLike);

        let thoughtsDelta = "";
        let newFullThought = "";
        if (thoughts) {
          const lastThought = lastThoughts[rcid] || lastThoughts[`idx_${i}`] || "";
          [thoughtsDelta, newFullThought] = getDeltaByFpLen(
            thoughts,
            lastThought,
            finalLike
          );
        }

        lastTexts[rcid] = newFullText;
        lastTexts[`idx_${i}`] = newFullText;
        lastThoughts[rcid] = newFullThought;
        lastThoughts[`idx_${i}`] = newFullThought;

        if (i === 0) {
          if (textDelta) {
            fire(onText, {kind: "delta", text: textDelta, full: newFullText, rcid});
          }
          if (thoughtsDelta) {
            fire(onThinking, {kind: "delta", text: thoughtsDelta, full: newFullThought, rcid});
          }
        }

        outputCandidates.push(
          new Candidate({
            rcid,
            text,
            textDelta,
            thoughts: thoughts || null,
            thoughtsDelta,
            webImages,
            generatedImages,
            generatedVideos,
            generatedMedia,
            deepResearchPlan,
          })
        );
      }
      if (outputCandidates.length) {
        isThinking = false;
        isQueueing = false;
        const mo = new ModelOutput({
          metadata: [cid, rid],
          candidates: outputCandidates,
          resolvedModel,
        });
        lastYielded = mo;
        yield mo;
      }
    }
  }

  while (true) {
    let chunk;
    try {
      const result = await reader.read();
      if (result.done) break;
      chunk = result.value;
    } catch (err) {
      if (verbose) {
        console.warn("[gemini] stream read aborted:", err.message);
      }
      throw err;
    }
    const decoded = decoder.decode(chunk, {stream: true});
    buffer += decoded;
    if (!initialPrefixStripped) {
      if (buffer.startsWith(")]}'")) {
        buffer = buffer.slice(4);
        initialPrefixStripped = true;
      } else if (buffer.length > 4) {
        initialPrefixStripped = true;
      }
    }
    const [parsedParts, remainder] = parseResponseByFrame(buffer);
    buffer = remainder;
    for await (const out of processParts(parsedParts)) yield out;
  }

  buffer += decoder.decode(new Uint8Array(), {stream: false});
  if (buffer) {
    const [parsedParts] = parseResponseByFrame(buffer);
    for await (const out of processParts(parsedParts)) yield out;
  }

  const placeholderRe = /(generating your (video|audio|music|image|track)|check back|will be ready|let you know when)/i;
  const lastText = lastYielded?.text || "";
  const lastHasAsset =
    !!lastYielded &&
    (lastYielded.videos.length > 0 ||
      lastYielded.media.length > 0 ||
      lastYielded.images.length > 0);
  const looksAsyncPlaceholder = !lastHasAsset && placeholderRe.test(lastText);
  const needRecovery =
    cid &&
    clientRef &&
    typeof clientRef.readChat === "function" &&
    ((!isCompleted && isFinalChunk) || looksAsyncPlaceholder);
  if (needRecovery) {
    if (verbose) {
      console.log(`[gemini] async asset pending — polling chat ${cid} for completion…`);
    }
    const pollIntervalMs = 8000;
    const recoveryDeadline = Date.now() + (clientRef.timeout || 450_000);
    while (Date.now() < recoveryDeadline) {
      if (typeof clientRef._sendBardActivity === "function") {
        try {
          await clientRef._sendBardActivity();
        } catch {
          /* swallow keepalive failures */
        }
      }
      let recoveredHistory = null;
      try {
        recoveredHistory = await clientRef.readChat(cid, {limit: 3});
      } catch {
        /* poll again on transient errors */
      }
      const turn =
        recoveredHistory && Array.isArray(recoveredHistory.turns)
          ? recoveredHistory.turns.find((t) => t.role === "model" && t.modelOutput)
          : null;
      const recovered = turn?.modelOutput || null;
      const hasAsset =
        recovered &&
        (recovered.videos.length > 0 ||
          recovered.media.some((m) => m.url) ||
          recovered.images.length > 0);
      if (recovered && hasAsset) {
        if (chat) {
          recovered.metadata = chat.metadata;
          chat.rcid = recovered.rcid;
        }
        yield recovered;
        return;
      }
      await new Promise((r) => setTimeout(r, pollIntervalMs));
    }
    if (verbose) {
      console.warn(`[gemini] async asset poll timed out for chat ${cid}`);
    }
  }
}

module.exports = {
  buildInnerRequest,
  parseCandidate,
  resolveModel,
  errorForCode,
  buildGenerateFormBody,
  iterateStream,
};
