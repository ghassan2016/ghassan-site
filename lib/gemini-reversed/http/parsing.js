// Google's length-prefixed framing protocol (BardFrontendService /
// batchexecute):
//   1. Body opens with a `)]}'` JSON-hijack guard.
//   2. Each frame is `<length>\n<json>\n` where `<length>` is the count of
//      UTF-16 code units of `<json>` *plus* the trailing `\n` of the JSON.
//   3. Frames whose payload is a list are spread into the parts stream.

const _LENGTH_MARKER_RE = /(\d+)\n/y;
const _FLICKER_ESC_RE = /\\+[`*_~].*$/;

function getCleanText(s) {
  if (!s) return "";
  if (s.endsWith("\n```")) s = s.slice(0, -4);
  return s.replace(_FLICKER_ESC_RE, "");
}

function getDeltaByFpLen(newRaw, lastSentClean, isFinal) {
  const newClean = isFinal ? newRaw : getCleanText(newRaw);
  if (newClean.startsWith(lastSentClean)) {
    return [newClean.slice(lastSentClean.length), newClean];
  }

  const searchLen = Math.min(
    Math.min(3000, Math.max(1000, lastSentClean.length)),
    lastSentClean.length,
    newClean.length
  );
  if (searchLen === 0) return [newClean, newClean];

  const tailLast = lastSentClean.slice(-searchLen);
  const tailNew = newClean.slice(-searchLen);

  const tailMatch = longestCommonSuffixOffset(tailLast, tailNew);
  if (tailMatch !== null) return [tailNew.slice(tailMatch), newClean];

  const fullMatch = longestCommonSuffixOffset(lastSentClean, newClean);
  if (fullMatch !== null) return [newClean.slice(fullMatch), newClean];

  return [newClean, newClean];
}

function longestCommonSuffixOffset(a, b) {
  if (!a || !b) return null;
  const maxLen = Math.min(a.length, b.length);
  for (let len = maxLen; len > 0; len -= 1) {
    const suffix = a.slice(-len);
    const idx = b.lastIndexOf(suffix);
    if (idx !== -1) return idx + len;
  }
  return null;
}

function getNestedValue(data, path, def = null) {
  let current = data;
  for (const key of path) {
    if (typeof key === "number") {
      if (
        Array.isArray(current) &&
        key >= -current.length &&
        key < current.length
      ) {
        current = current[key < 0 ? current.length + key : key];
      } else {
        return def;
      }
    } else if (typeof key === "string") {
      if (
        current &&
        typeof current === "object" &&
        !Array.isArray(current) &&
        key in current
      ) {
        current = current[key];
      } else {
        return def;
      }
    } else {
      return def;
    }
  }
  return current === null || current === undefined ? def : current;
}

function _getCharCountForUtf16Units(s, startIdx, utf16Units) {
  let count = 0;
  let units = 0;
  const limit = s.length;
  while (units < utf16Units && startIdx + count < limit) {
    const code = s.charCodeAt(startIdx + count);
    const u = code >= 0xd800 && code <= 0xdbff ? 2 : 1;
    if (units + u > utf16Units) break;
    units += u;
    count += 1;
    const isHighSurrogate = code >= 0xd800 && code <= 0xdbff;
    if (isHighSurrogate && startIdx + count + 1 < limit) {
      // Full surrogate pair: 2 code units worth of budget, 2 index advance.
      if (units + 2 > utf16Units) break;
      units += 2;
      count += 2;
    } else {
      if (units + 1 > utf16Units) break;
      units += 1;
      count += 1;
    }
  }
  return [count, units];
}

function parseResponseByFrame(content) {
  let consumed = 0;
  const total = content.length;
  const frames = [];

  while (consumed < total) {
    while (consumed < total && /\s/.test(content[consumed])) consumed += 1;
    if (consumed >= total) break;

    _LENGTH_MARKER_RE.lastIndex = consumed;
    const match = _LENGTH_MARKER_RE.exec(content);
    if (!match || match.index !== consumed) break;

    const lengthStr = match[1];
    const length = parseInt(lengthStr, 10);
    // Length counts from the `\n` right after the digits, so start at the
    // end of the digit run (not after the newline).
    const startContent = consumed + lengthStr.length;
    const [charCount, unitsFound] = _getCharCountForUtf16Units(
      content,
      startContent,
      length
    );

    if (unitsFound < length) break;

    const endPos = startContent + charCount;
    const chunk = content.slice(startContent, endPos).trim();
    consumed = endPos;
    if (!chunk) continue;

    let parsed;
    try {
      parsed = JSON.parse(chunk);
    } catch {
      continue;
    }
    if (Array.isArray(parsed)) frames.push(...parsed);
    else frames.push(parsed);
  }

  return [frames, content.slice(consumed)];
}

function extractJsonFromResponse(text) {
  if (typeof text !== "string") {
    throw new TypeError(
      `extractJsonFromResponse: expected string, got ${typeof text}`
    );
  }
  let content = text;
  if (content.startsWith(")]}'")) content = content.slice(4);
  content = content.replace(/^\s+/, "");

  const [framed] = parseResponseByFrame(content);
  if (framed.length > 0) return framed;

  const stripped = content.trim();
  try {
    const parsed = JSON.parse(stripped);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    /* fall through to NDJSON */
  }

  const collected = [];
  for (const line of stripped.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) collected.push(...parsed);
      else if (parsed && typeof parsed === "object") collected.push(parsed);
    } catch {
      /* skip */
    }
  }
  if (collected.length > 0) return collected;

  throw new Error("Could not find a valid JSON object or array in the response");
}

module.exports = {
  getCleanText,
  getDeltaByFpLen,
  getNestedValue,
  parseResponseByFrame,
  extractJsonFromResponse,
};
