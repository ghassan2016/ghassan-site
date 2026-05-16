const {SIMULATED_BROWSER} = require("./browser");
const {Headers} = require("../constants");

function buildBrowserHeaders({
  accept = "*/*",
  contentType,
  cookieHeader,
} = {}) {
  const headers = {
    accept,
    "accept-language": SIMULATED_BROWSER.acceptLanguage,
    Origin: "https://gemini.google.com",
    Referer: "https://gemini.google.com/",
    "sec-ch-ua": SIMULATED_BROWSER.uaBrands,
    "sec-ch-ua-mobile": SIMULATED_BROWSER.mobile,
    "sec-ch-ua-platform": `"${SIMULATED_BROWSER.platform}"`,
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "User-Agent": SIMULATED_BROWSER.agent,
  };
  if (contentType) headers["Content-Type"] = contentType;
  if (cookieHeader) headers.Cookie = cookieHeader;
  return headers;
}

function buildGeminiPostHeaders({extra = {}, cookieHeader} = {}) {
  return {
    ...buildBrowserHeaders({
      accept: "*/*",
      contentType: "application/x-www-form-urlencoded;charset=utf-8",
      cookieHeader,
    }),
    ...Headers.SAME_DOMAIN,
    ...extra,
  };
}

module.exports = {buildBrowserHeaders, buildGeminiPostHeaders};
