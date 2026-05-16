const fs = require("fs");
const path = require("path");
const {Endpoint, Headers} = require("../constants");
const {buildBrowserHeaders} = require("./headers");

const MIME_BY_EXT = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".bmp": "image/bmp",
  ".tif": "image/tiff",
  ".tiff": "image/tiff",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".txt": "text/plain",
  ".md": "text/markdown",
  ".csv": "text/csv",
  ".json": "application/json",
  ".html": "text/html",
  ".htm": "text/html",
  ".xml": "application/xml",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
  ".zip": "application/zip",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

function guessMime(filename) {
  if (!filename) return "application/octet-stream";
  const ext = path.extname(String(filename)).toLowerCase();
  return MIME_BY_EXT[ext] || "application/octet-stream";
}

function generateRandomName(extension = ".txt") {
  const n = Math.floor(1_000_000 + Math.random() * 9_000_000);
  return `input_${n}${extension}`;
}

function normalizeFileInput(file) {
  if (file == null) {
    throw new Error("upload: file is required");
  }
  if (typeof file === "string") {
    if (!fs.existsSync(file)) {
      throw new Error(`upload: ${file} is not a valid file`);
    }
    const bytes = fs.readFileSync(file);
    const name = path.basename(file);
    return {bytes, name, mime: guessMime(name)};
  }
  if (Buffer.isBuffer(file)) {
    const name = generateRandomName();
    return {bytes: file, name, mime: guessMime(name)};
  }
  if (file && typeof file === "object") {
    let bytes = file.bytes;
    let name = file.name;
    if (!bytes && typeof file.path === "string") {
      if (!fs.existsSync(file.path)) {
        throw new Error(`upload: ${file.path} is not a valid file`);
      }
      bytes = fs.readFileSync(file.path);
      if (!name) name = path.basename(file.path);
    }
    if (!bytes) throw new Error("upload: file object missing `bytes` or `path`");
    if (!Buffer.isBuffer(bytes)) bytes = Buffer.from(bytes);
    if (!name) name = generateRandomName();
    const mime = file.mime || guessMime(name);
    return {bytes, name, mime};
  }
  throw new Error(`upload: unsupported file type ${typeof file}`);
}

function parseFileName(file) {
  if (typeof file === "string") {
    if (!fs.existsSync(file)) {
      throw new Error(`upload: ${file} is not a valid file`);
    }
    return path.basename(file);
  }
  if (file && typeof file === "object") {
    if (file.name) return String(file.name);
    if (typeof file.path === "string") return path.basename(file.path);
  }
  return generateRandomName();
}

async function uploadFile({
  file,
  cookieHeader = null,
  pushId = null,
  filename = null,
}) {
  const normalized = normalizeFileInput(file);
  if (filename) normalized.name = filename;

  const formData = new FormData();
  const blob = new Blob([normalized.bytes], {type: normalized.mime});
  formData.append("file", blob, normalized.name);

  const headers = {
    ...buildBrowserHeaders({accept: "*/*", cookieHeader}),
    ...Headers.UPLOAD,
  };
  if (pushId) headers["Push-ID"] = pushId;

  const response = await fetch(Endpoint.UPLOAD, {
    method: "POST",
    headers,
    body: formData,
    redirect: "follow",
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(
      `upload failed (${response.status} ${response.statusText})${
        errBody ? ` — ${errBody.slice(0, 200)}` : ""
      }`
    );
  }
  return (await response.text()).trim();
}

module.exports = {
  uploadFile,
  parseFileName,
  normalizeFileInput,
  guessMime,
  generateRandomName,
};
