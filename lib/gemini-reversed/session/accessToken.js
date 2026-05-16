const {Endpoint, Headers} = require("../constants");
const {AuthError} = require("../exceptions");
const {CookieJar} = require("../auth/CookieJar");
const {buildBrowserHeaders} = require("../http/headers");

// Bootstraps a session by GET-ing https://gemini.google.com/app and
// extracting the inline session markers:
//   SNlM0e → accessToken (the `at` field on every BardFrontendService POST)
//   cfb2h  → buildLabel (the `bl` query param)
//   FdrFJe → sessionId (`f.sid`)
//   TuX5cc → UI language
//   qKIAYe → file push id (Push-ID header for content-push uploads)
async function fetchAccessToken({cookies, verbose = false} = {}) {
  if (!(cookies instanceof CookieJar)) {
    throw new Error("fetchAccessToken: `cookies` must be a CookieJar instance");
  }

  // Warm up against google.com so the IP+UA pair has had at least one
  // consumer-style hit before the gemini.google.com GET.
  try {
    const warmup = await fetch(Endpoint.GOOGLE, {
      method: "GET",
      headers: buildBrowserHeaders({accept: "*/*"}),
      redirect: "follow",
    });
    cookies.absorbResponse(warmup);
    if (verbose) {
      console.log(`[gemini] warm-up GET ${Endpoint.GOOGLE} → ${warmup.status}`);
    }
    await warmup.text().catch(() => "");
  } catch (err) {
    if (verbose) {
      console.warn("[gemini] warm-up failed (non-fatal):", err.message);
    }
  }

  const cookieHeader = cookies.toHeader();
  const response = await fetch(Endpoint.INIT, {
    method: "GET",
    headers: {
      ...buildBrowserHeaders({accept: "*/*", cookieHeader}),
      ...Headers.GEMINI,
      ...(cookieHeader ? {Cookie: cookieHeader} : {}),
    },
    redirect: "follow",
  });
  cookies.absorbResponse(response);

  if (verbose) {
    console.log(`[gemini] GET ${Endpoint.INIT} → ${response.status}`);
  }
  if (!response.ok) {
    throw new AuthError(
      `fetchAccessToken: ${Endpoint.INIT} returned ${response.status} ${response.statusText}`
    );
  }

  const body = await response.text();
  const accessToken = matchOnce(body, /"SNlM0e":\s*"(.*?)"/);
  const buildLabel = matchOnce(body, /"cfb2h":\s*"(.*?)"/);
  const sessionId = matchOnce(body, /"FdrFJe":\s*"(.*?)"/);
  const language = matchOnce(body, /"TuX5cc":\s*"(.*?)"/);
  const pushId = matchOnce(body, /"qKIAYe":\s*"(.*?)"/);

  if (!accessToken && !buildLabel && !sessionId && !language && !pushId) {
    throw new AuthError(
      "fetchAccessToken: no session markers found on gemini.google.com/app — " +
        "cookies may be expired or invalid. Re-export __Secure-1PSID and " +
        "__Secure-1PSIDTS from a logged-in browser session."
    );
  }
  return {
    accessToken,
    buildLabel,
    sessionId,
    language: language || "en",
    pushId: pushId || "feeds/mcudyrk2a4khkz",
    cookies,
  };
}

function matchOnce(haystack, regex) {
  const m = haystack.match(regex);
  return m ? m[1] : null;
}

module.exports = {fetchAccessToken};
