const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const {buildBrowserHeaders} = require("../http/headers");
const {extFromContentType} = require("./Image");

class Video {
  constructor({url, title = "[Video]", proxy = null, clientRef = null} = {}) {
    if (!url) throw new Error("Video: `url` is required");
    this.url = url;
    this.title = title;
    this.proxy = proxy;
    this.clientRef = clientRef;
    this._defaultFilenameSuffix = "video";
  }

  _urlForHash() {
    return this.url;
  }

  toString() {
    return `Video(title=${JSON.stringify(this.title)}, url=${JSON.stringify(this.url)})`;
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
    const videoPath = await Video._downloadFile({
      url: this.url,
      savePath,
      filename,
      defaultExt: ".mp4",
      verbose,
      cookieHeader: this.clientRef?.cookies?.toHeader?.() || null,
    });
    return {video: videoPath, video_thumbnail: null};
  }

  static async _downloadFile({
    url,
    savePath,
    filename,
    defaultExt = ".mp4",
    verbose = false,
    cookieHeader = null,
  }) {
    const response = await fetch(url, {
      method: "GET",
      headers: buildBrowserHeaders({accept: "*/*", cookieHeader}),
      redirect: "follow",
    });
    if (verbose) {
      console.log(`[gemini] GET ${url} → ${response.status}`);
    }
    if (response.status === 206) return "206";
    if (!response.ok) {
      throw new Error(
        `Error downloading file: ${response.status} ${response.statusText}`
      );
    }
    let outName = filename;
    if (!path.extname(outName)) {
      const ct = (response.headers.get("content-type") || "").split(";")[0].toLowerCase();
      outName += extFromContentType(ct, defaultExt);
    }
    const dest = path.join(savePath, outName);
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(dest, buffer);
    if (verbose) {
      console.log(`[gemini] file saved → ${dest}`);
    }
    return path.resolve(dest);
  }
}

class GeneratedVideo extends Video {
  constructor({thumbnail = "", cid = "", rid = "", rcid = "", ...rest} = {}) {
    super(rest);
    this.thumbnail = thumbnail;
    this.cid = cid;
    this.rid = rid;
    this.rcid = rcid;
    this._defaultFilenameSuffix = "generated_video";
  }

  async _performSave({savePath, filename, verbose}) {
    let thumbPath = null;
    const cookieHeader = this.clientRef?.cookies?.toHeader?.() || null;
    if (this.thumbnail) {
      const thumbBase = path.basename(filename, path.extname(filename));
      try {
        thumbPath = await Video._downloadFile({
          url: this.thumbnail,
          savePath,
          filename: thumbBase,
          defaultExt: ".jpg",
          verbose,
          cookieHeader,
        });
      } catch (err) {
        if (verbose) {
          console.warn(`[gemini] thumbnail save failed: ${err.message}`);
        }
      }
    }

    const maxAttempts = 60;
    for (let attempt = 1; ; attempt += 1) {
      const result = await Video._downloadFile({
        url: this.url,
        savePath,
        filename,
        defaultExt: ".mp4",
        verbose,
        cookieHeader,
      });
      if (result !== "206") return {video: result, video_thumbnail: thumbPath};
      if (attempt >= maxAttempts) {
        throw new Error(
          `Video renderer kept returning 206 after ${attempt} attempts (~${attempt * 10}s).`
        );
      }
      if (verbose) {
        console.log("[gemini] video still generating (206), retrying in 10s…");
      }
      await sleep(10000);
    }
  }
}

class GeneratedMedia extends GeneratedVideo {
  constructor({mp3Url = "", mp3Thumbnail = "", title = "[Media]", ...rest} = {}) {
    super({...rest, title});
    this.mp3Url = mp3Url;
    this.mp3Thumbnail = mp3Thumbnail;
    this._defaultFilenameSuffix = "media";
  }

  _urlForHash() {
    return this.url || this.mp3Url;
  }

  get mp4Url() {
    return this.url;
  }
  set mp4Url(value) {
    this.url = value;
  }
  get mp4Thumbnail() {
    return this.thumbnail;
  }
  set mp4Thumbnail(value) {
    this.thumbnail = value;
  }

  async _performSave({savePath, filename, verbose, downloadType = "both"}) {
    const cookieHeader = this.clientRef?.cookies?.toHeader?.() || null;
    const tasks = [];
    const polling = async (url, ext, key) => {
      while (true) {
        const result = await Video._downloadFile({
          url,
          savePath,
          filename,
          defaultExt: ext,
          verbose,
          cookieHeader,
        });
        if (result === "206") {
          if (verbose) {
            console.log(`[gemini] media (${key}) still generating (206), retrying in 10s…`);
          }
          await sleep(10000);
          continue;
        }
        return [key, result];
      }
    };
    const thumbnail = async (url, name, key) => {
      try {
        const result = await Video._downloadFile({
          url,
          savePath,
          filename: name,
          defaultExt: ".jpg",
          verbose,
          cookieHeader,
        });
        return [key, result];
      } catch (err) {
        if (verbose) {
          console.warn(`[gemini] thumbnail save failed (${key}): ${err.message}`);
        }
        return [key, null];
      }
    };

    if ((downloadType === "audio" || downloadType === "both") && this.mp3Url) {
      tasks.push(polling(this.mp3Url, ".mp3", "audio"));
      if (this.mp3Thumbnail) {
        tasks.push(thumbnail(this.mp3Thumbnail, `${filename}_audio_thumb`, "audio_thumbnail"));
      }
    }
    if ((downloadType === "video" || downloadType === "both") && this.url) {
      tasks.push(polling(this.url, ".mp4", "video"));
      if (this.thumbnail) {
        tasks.push(thumbnail(this.thumbnail, `${filename}_video_thumb`, "video_thumbnail"));
      }
    }

    const results = {};
    for (const [key, val] of await Promise.all(tasks)) results[key] = val;
    return results;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {Video, GeneratedVideo, GeneratedMedia};
