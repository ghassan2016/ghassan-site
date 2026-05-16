// Updating the UA here requires updating `sec-ch-ua` in src/http/headers.js
// at the same time — BardFrontendService cross-checks them on POSTs.
const SIMULATED_BROWSER = {
  agent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
  platform: "Windows",
  mobile: "?0",
  uaBrands: '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
  language: "en-US",
  acceptLanguage: "en-US,en;q=0.9",
  timezone: "Europe/Berlin",
  timezoneOffsetMin: -60,
};

module.exports = {SIMULATED_BROWSER};
