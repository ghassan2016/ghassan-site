const fs = require("fs");

class CookieJar {
  constructor(entries = []) {
    this._map = new Map();
    if (Array.isArray(entries)) {
      for (const entry of entries) {
        if (entry && typeof entry.name === "string") {
          this._map.set(entry.name, String(entry.value ?? ""));
        }
      }
    } else if (entries && typeof entries === "object") {
      for (const [name, value] of Object.entries(entries)) {
        if (typeof name === "string") this._map.set(name, String(value ?? ""));
      }
    }
  }

  static fromFile(filePath) {
    const raw = fs.readFileSync(filePath, "utf8").trim();
    if (!raw) throw new Error(`CookieJar.fromFile: ${filePath} is empty`);
    if (raw.startsWith("[") || raw.startsWith("{")) {
      return CookieJar.fromAny(JSON.parse(raw));
    }
    return CookieJar.fromHeader(raw);
  }

  static fromString(value) {
    if (typeof value !== "string") {
      throw new Error(`CookieJar.fromString expected a string, got ${typeof value}`);
    }
    const trimmed = value.trim();
    if (!trimmed) throw new Error("CookieJar.fromString: empty string");
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      return CookieJar.fromAny(JSON.parse(trimmed));
    }
    return CookieJar.fromHeader(trimmed);
  }

  static fromAny(value) {
    if (value instanceof CookieJar) return value;
    if (Array.isArray(value)) return new CookieJar(value);
    if (typeof value === "string") return CookieJar.fromString(value);
    if (!value || typeof value !== "object") {
      throw new Error("CookieJar: cookie source must be an array, object, or string");
    }
    if (Array.isArray(value.cookies)) return new CookieJar(value.cookies);
    if (value.cookies && typeof value.cookies === "object") {
      return new CookieJar(value.cookies);
    }
    return new CookieJar(value);
  }

  static fromHeader(headerString) {
    if (typeof headerString !== "string") {
      throw new Error(
        `CookieJar.fromHeader expected a string, got ${typeof headerString}`
      );
    }
    const jar = new CookieJar();
    const cleaned = headerString.replace(/^Cookie:\s*/i, "");
    for (const pair of cleaned.split(/;\s*/)) {
      if (!pair) continue;
      const eq = pair.indexOf("=");
      if (eq === -1) continue;
      const name = pair.slice(0, eq).trim();
      if (!name) continue;
      jar.set(name, pair.slice(eq + 1).trim());
    }
    return jar;
  }

  get(name) {
    return this._map.get(name);
  }

  set(name, value) {
    this._map.set(name, String(value ?? ""));
    return this;
  }

  has(name) {
    return this._map.has(name);
  }

  delete(name) {
    return this._map.delete(name);
  }

  names() {
    return [...this._map.keys()];
  }

  absorbSetCookie(rawHeader) {
    if (!rawHeader) return;
    const list = Array.isArray(rawHeader) ? rawHeader : [rawHeader];
    for (const raw of list) {
      const first = String(raw).split(";")[0];
      const eq = first.indexOf("=");
      if (eq < 1) continue;
      const name = first.slice(0, eq).trim();
      const value = first.slice(eq + 1).trim();
      if (name) this._map.set(name, value);
    }
  }

  absorbResponse(response) {
    if (!response?.headers) return;
    const list = response.headers.getSetCookie
      ? response.headers.getSetCookie()
      : [response.headers.get("set-cookie")].filter(Boolean);
    this.absorbSetCookie(list);
  }

  toHeader(names = null) {
    const entries = names
      ? names.filter((n) => this._map.has(n)).map((n) => [n, this._map.get(n)])
      : [...this._map.entries()];
    return entries.map(([k, v]) => `${k}=${v}`).join("; ");
  }

  toJSON() {
    return [...this._map.entries()].map(([name, value]) => ({name, value}));
  }

  saveToFile(filePath) {
    const payload = JSON.stringify(this.toJSON(), null, 2);
    fs.writeFileSync(filePath, payload, {encoding: "utf8", mode: 0o600});
  }

  clone() {
    const copy = new CookieJar();
    copy._map = new Map(this._map);
    return copy;
  }

  get size() {
    return this._map.size;
  }
}

module.exports = {CookieJar};
