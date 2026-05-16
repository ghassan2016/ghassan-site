const {getNestedValue} = require("../http/parsing");

const _RESEARCH_ID_RE =
  /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i;
const _CHAT_ID_RE = /\bc_[A-Za-z0-9_]+\b/;
const _URL_RE = /^https?:\/\//;

function* iterNested(data) {
  yield data;
  if (Array.isArray(data)) {
    for (const item of data) yield* iterNested(item);
  } else if (data && typeof data === "object") {
    for (const item of Object.values(data)) yield* iterNested(item);
  }
}

function _findFirstMatch(data, pattern) {
  for (const item of iterNested(data)) {
    if (typeof item === "string") {
      const match = item.match(pattern);
      if (match) return match[0];
    }
  }
  return null;
}

function _findFirstString(data, exclude = new Set()) {
  for (const item of iterNested(data)) {
    if (typeof item === "string" && item && !exclude.has(item)) return item;
  }
  return null;
}

function _extractResearchId(data) {
  return _findFirstMatch(data, _RESEARCH_ID_RE);
}

function _extractChatId(data) {
  return _findFirstMatch(data, _CHAT_ID_RE);
}

function _collectResearchNotes(data, exclude = new Set()) {
  const notes = [];
  const seen = new Set();
  for (const item of iterNested(data)) {
    if (typeof item !== "string") continue;
    const text = item.trim();
    if (
      !text ||
      exclude.has(text) ||
      seen.has(text) ||
      _URL_RE.test(text) ||
      text.length < 12
    )
      continue;
    seen.add(text);
    notes.push(text);
    if (notes.length >= 12) break;
  }
  return notes;
}

function _findFirstDictKey(data, key) {
  for (const item of iterNested(data)) {
    if (item && typeof item === "object" && !Array.isArray(item) && key in item) {
      return item;
    }
  }
  return null;
}

function extractDeepResearchPlan(candidateData, fallbackText = "") {
  let metaDict = null;
  let payload = null;
  for (const key of ["56", "57"]) {
    metaDict = _findFirstDictKey(candidateData, key);
    if (metaDict && Array.isArray(metaDict[key])) {
      payload = metaDict[key];
      break;
    }
  }
  if (!metaDict || !payload) return null;

  const researchId = _extractResearchId(candidateData);
  const title = getNestedValue(payload, [0]);
  const stepsPayload = getNestedValue(payload, [1], []);
  const steps = [];
  if (Array.isArray(stepsPayload)) {
    for (const step of stepsPayload) {
      if (!Array.isArray(step)) continue;
      const label = step.length > 1 && typeof step[1] === "string" ? step[1] : null;
      const body = step.length > 2 && typeof step[2] === "string" ? step[2] : null;
      if (label && body) steps.push(`${label}: ${body}`);
      else if (body) steps.push(body);
      else if (label) steps.push(label);
    }
  }

  const modifyPayload = getNestedValue(payload, [5]);
  let modifyPrompt = null;
  if (Array.isArray(modifyPayload)) {
    modifyPrompt = _findFirstString(modifyPayload);
  }

  const queryRaw = getNestedValue(payload, [1, 0, 2]);
  const query = typeof queryRaw === "string" ? queryRaw : null;
  const etaRaw = getNestedValue(payload, [2]);
  const etaText = typeof etaRaw === "string" ? etaRaw : null;
  const confirmRaw = getNestedValue(payload, [3, 0]);
  const confirmPrompt = typeof confirmRaw === "string" ? confirmRaw : null;
  const confUrlRaw = getNestedValue(payload, [4, 0]);
  const confirmationUrl = typeof confUrlRaw === "string" ? confUrlRaw : null;
  const rawState = typeof metaDict["70"] === "number" ? metaDict["70"] : null;

  if (
    !(typeof title === "string") &&
    !query &&
    steps.length === 0 &&
    !etaText &&
    !confirmPrompt &&
    !confirmationUrl &&
    !modifyPrompt
  ) {
    return null;
  }
  return {
    researchId,
    title: typeof title === "string" ? title : null,
    query,
    steps,
    etaText,
    confirmPrompt,
    confirmationUrl,
    modifyPrompt,
    rawState,
    responseText: fallbackText || null,
  };
}

function extractDeepResearchStatusPayload(payload) {
  const data =
    Array.isArray(payload) && payload.length && Array.isArray(payload[0])
      ? payload[0]
      : payload;
  const researchId = _extractResearchId(data);
  if (!researchId) return null;

  const title = getNestedValue(data, [1, 4, 0]);
  const query = getNestedValue(data, [1, 4, 1]);
  const cid = getNestedValue(data, [1, 3, 0]) || _extractChatId(data);
  let rawState = null;
  const metaDict = _findFirstDictKey(data, "70");
  if (metaDict && typeof metaDict["70"] === "number") {
    rawState = metaDict["70"];
  }

  const markerStrings = [];
  for (const item of iterNested(data)) {
    if (typeof item === "string" && item) markerStrings.push(item);
  }
  const done = markerStrings.some((s) => s.includes("immersive_entry_chip"));
  const awaitingConfirmation = markerStrings.some((s) =>
    s.includes("deep_research_confirmation_content")
  );
  const state = done
    ? "completed"
    : awaitingConfirmation
      ? "awaiting_confirmation"
      : "running";

  const exclude = new Set(
    [title, query, researchId, cid].filter((v) => typeof v === "string")
  );
  const notes = _collectResearchNotes(data, exclude);

  return {
    researchId,
    state,
    title: typeof title === "string" ? title : null,
    query: typeof query === "string" ? query : null,
    cid: typeof cid === "string" ? cid : null,
    notes,
    done,
    rawState,
    raw: payload,
  };
}

module.exports = {
  extractDeepResearchPlan,
  extractDeepResearchStatusPayload,
};
