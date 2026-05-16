const {AnonGemini} = require("./clients/AnonGemini");
const {AuthGemini} = require("./clients/AuthGemini");
const {BaseGemini, ChatSession} = require("./clients/BaseGemini");
const {CookieJar} = require("./auth/CookieJar");
const {fetchAccessToken} = require("./session/accessToken");
const {rotate1PSIDTS} = require("./session/rotate");
const {uploadFile, parseFileName} = require("./http/upload");

const {
  Endpoint,
  Headers,
  GRPC,
  Models,
  modelFromName,
  modelFromDict,
  AccountStatus,
  ErrorCode,
  buildModelHeader,
  MODEL_HEADER_KEY,
  STREAMING_FLAG_INDEX,
  GEM_FLAG_INDEX,
  TEMPORARY_CHAT_FLAG_INDEX,
  DEFAULT_METADATA,
} = require("./constants");

const exceptions = require("./exceptions");
const types = require("./types");

module.exports = {
  AnonGemini,
  AuthGemini,
  ChatSession,
  BaseGemini,
  CookieJar,
  fetchAccessToken,
  rotate1PSIDTS,
  uploadFile,
  parseFileName,
  Endpoint,
  Headers,
  GRPC,
  Models,
  modelFromName,
  modelFromDict,
  AccountStatus,
  ErrorCode,
  buildModelHeader,
  MODEL_HEADER_KEY,
  STREAMING_FLAG_INDEX,
  GEM_FLAG_INDEX,
  TEMPORARY_CHAT_FLAG_INDEX,
  DEFAULT_METADATA,
  ...exceptions,
  ...types,
};
