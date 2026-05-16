const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const {buildBrowserHeaders} = require("../http/headers");

class Image {
  constructor({url, title = "[Image]", alt = "", proxy = null, clientRef = null} = {}) {
    if (!url) throw new Error("Image: `url` is required");
    this.url = url;
    this.title = title;
    this.alt = alt;
    this.proxy = proxy;
    this.clientRef = clientRef;
    this._defaultFilenameSuffix = "image";
  }

  _urlForHash() {
    return this.url;
  }

  toString() {
    return `Image(title=${JSON.stringify(this.title)}, url=${JSON.stringify(this.url)})`;
  }

  async save({savePath = "temp", filename = null, verbose = false, ...kwargs} = {}) {
    let resolvedFilename = filename;
    if (!resolvedFilename || !path.extname(resolvedFilename)) {
      const stamp = new Date()
        .toISOString()
        .replace(/[-:T]/g, "")
        .replace(/\..+$/, "");
      const urlHash = crypto
        .createHash("sha256")
        .update(this._urlForHash())
        .digest("hex")
        .slice(0, 10);
      const baseName = resolvedFilename
        ? path.basename(resolvedFilename, path.extname(resolvedFilename))
        : this._defaultFilenameSuffix;
      resolvedFilename = `${stamp}_${urlHash}_${baseName}`;
    }

    fs.mkdirSync(savePath, {recursive: true});
    return this._performSave({savePath, filename: resolvedFilename, verbose, ...kwargs});
  }

  async _performSave({savePath, filename, verbose}) {
    const cookieHeader = this.clientRef?.cookies?.toHeader?.() || null;
    const response = await fetch(this.url, {
      method: "GET",
      headers: buildBrowserHeaders({accept: "*/*", cookieHeader}),
      redirect: "follow",
    });
    if (verbose) {
      console.log(`[gemini] GET ${this.url} → ${response.status}`);
    }
    if (!response.ok) {
      throw new Error(
        `Error downloading image: ${response.status} ${response.statusText}`
      );
    }
    let outName = filename;
    if (!path.extname(outName)) {
      const ct = (response.headers.get("content-type") || "").split(";")[0].toLowerCase();
      outName += extFromContentType(ct, ".png");
    }
    const dest = path.join(savePath, outName);
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(dest, buffer);
    if (verbose) {
      console.log(`[gemini] image saved → ${dest}`);
    }
    return path.resolve(dest);
  }
}

class WebImage extends Image {
  constructor(props) {
    super(props);
    this._defaultFilenameSuffix = "web_image";
  }
}

class GeneratedImage extends Image {
  constructor({cid = "", rid = "", rcid = "", imageId = "", ...rest} = {}) {
    super(rest);
    this.cid = cid;
    this.rid = rid;
    this.rcid = rcid;
    this.imageId = imageId;
    this._defaultFilenameSuffix = "generated";
  }

  async _performSave({savePath, filename, verbose, fullSize = true}) {
    if (fullSize) {
      const ready =
        this.clientRef && this.cid && this.rid && this.rcid && this.imageId;
      if (ready) {
        try {
          const originalUrl = await this.clientRef._getFullSizeImage({
            cid: this.cid,
            rid: this.rid,
            rcid: this.rcid,
            imageId: this.imageId,
          });
          if (originalUrl) {
            const reqUrl = `${originalUrl}=d-I?alr=yes`;
            const cookieHeader = this.clientRef?.cookies?.toHeader?.() || null;
            const headers = buildBrowserHeaders({accept: "*/*", cookieHeader});

            const r1 = await fetch(reqUrl, {method: "GET", headers, redirect: "follow"});
            if (!r1.ok) throw new Error(`fullsize step1 ${r1.status}`);
            const u1 = (await r1.text()).trim();

            const r2 = await fetch(u1, {method: "GET", headers, redirect: "follow"});
            if (!r2.ok) throw new Error(`fullsize step2 ${r2.status}`);
            this.url = (await r2.text()).trim();

            return super._performSave({savePath, filename, verbose});
          }
        } catch (err) {
          if (verbose) {
            console.warn(
              `[gemini] full-size RPC failed (${err.message}), falling back to URL suffix`
            );
          }
        }
      }
      if (this.url.includes("=s1024-rj")) {
        this.url = this.url.replace("=s1024-rj", "=s2048-rj");
      } else if (!this.url.includes("=s2048-rj")) {
        this.url += "=s2048-rj";
      }
    } else {
      if (this.url.includes("=s2048-rj")) {
        this.url = this.url.replace("=s2048-rj", "=s1024-rj");
      } else if (!this.url.includes("=s1024-rj")) {
        this.url += "=s1024-rj";
      }
    }
    return super._performSave({savePath, filename, verbose});
  }
}

function extFromContentType(contentType, fallback = ".bin") {
  if (!contentType) return fallback;
  if (contentType.includes("png")) return ".png";
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return ".jpg";
  if (contentType.includes("webp")) return ".webp";
  if (contentType.includes("gif")) return ".gif";
  if (contentType.includes("mp4")) return ".mp4";
  if (contentType.includes("mpeg")) return ".mp3";
  return fallback;
}

module.exports = {Image, WebImage, GeneratedImage, extFromContentType};
