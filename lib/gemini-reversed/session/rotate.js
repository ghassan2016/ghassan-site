const {Endpoint, Headers} = require("../constants");
const {AuthError} = require("../exceptions");
const {buildBrowserHeaders} = require("../http/headers");

// Refresh __Secure-1PSIDTS via accounts.google.com/RotateCookies. Mutates
// the supplied jar in place. 401 → AuthError (cookies stale).
async function rotate1PSIDTS({cookies, verbose = false}) {
  const cookieHeader = cookies.toHeader();
  if (!cookieHeader) return null;

  const response = await fetch(Endpoint.ROTATE_COOKIES, {
    method: "POST",
    headers: {
      ...buildBrowserHeaders({accept: "*/*"}),
      ...Headers.ROTATE_COOKIES,
      Cookie: cookieHeader,
    },
    body: '[000,"-0000000000000000000"]',
  });
  if (verbose) {
    console.log(
      `[gemini] POST ${Endpoint.ROTATE_COOKIES} → ${response.status}`
    );
  }
  if (response.status === 401) {
    throw new AuthError(
      "Cookie rotation returned 401 — __Secure-1PSID has expired. " +
        "Re-export cookies from your browser."
    );
  }
  if (response.status === 429) {
    if (verbose) {
      console.log(
        `[gemini] RotateCookies 429 — current __Secure-1PSIDTS is still fresh; skipping`
      );
    }
    await response.text().catch(() => "");
    return cookies.get("__Secure-1PSIDTS") || null;
  }
  if (!response.ok) {
    throw new Error(
      `rotate1PSIDTS: ${Endpoint.ROTATE_COOKIES} returned ${response.status} ${response.statusText}`
    );
  }

  cookies.absorbResponse(response);
  await response.text().catch(() => "");
  return cookies.get("__Secure-1PSIDTS") || null;
}

module.exports = {rotate1PSIDTS};
