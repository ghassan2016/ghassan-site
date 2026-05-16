const {BaseGemini} = require("./BaseGemini");
const {CookieJar} = require("../auth/CookieJar");
const {AuthError} = require("../exceptions");

class AuthGemini extends BaseGemini {
  constructor({
    cookies,
    cookiesPath,
    secure1psid,
    secure1psidts,
    proxy = null,
    verbose = false,
  } = {}) {
    super({proxy, verbose});
    this._cookieJar = AuthGemini._resolveJar({
      cookies,
      cookiesPath,
      secure1psid,
      secure1psidts,
    });
  }

  static _resolveJar({cookies, cookiesPath, secure1psid, secure1psidts}) {
    if (cookies !== undefined && cookies !== null) {
      try {
        return CookieJar.fromAny(cookies);
      } catch (err) {
        throw new AuthError(`AuthGemini: invalid \`cookies\` — ${err.message}`);
      }
    }
    if (typeof cookiesPath === "string" && cookiesPath) {
      try {
        return CookieJar.fromFile(cookiesPath);
      } catch (err) {
        throw new AuthError(`AuthGemini: cannot load \`cookiesPath\` — ${err.message}`);
      }
    }
    if (secure1psid) {
      const jar = new CookieJar();
      jar.set("__Secure-1PSID", secure1psid);
      if (secure1psidts) jar.set("__Secure-1PSIDTS", secure1psidts);
      return jar;
    }
    throw new AuthError(
      "AuthGemini requires one of: `cookies` (CookieJar | array | object | JSON string | header string), " +
        "`cookiesPath` (JSON or header-string file), or `secure1psid` (+ optional `secure1psidts`)"
    );
  }

  async _prepareCookies() {
    this._cookies = this._cookieJar;
    return this._cookies;
  }
}

module.exports = {AuthGemini};
