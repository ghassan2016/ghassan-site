const STREAMING_FLAG_INDEX = 7;
const GEM_FLAG_INDEX = 19;
const TEMPORARY_CHAT_FLAG_INDEX = 45;

const CARD_CONTENT_RE = /^http:\/\/googleusercontent\.com\/card_content\/\d+/;
const ARTIFACTS_RE = /http:\/\/googleusercontent\.com\/\w+\/\d+\n*/g;

const DEFAULT_METADATA = ["", "", "", null, null, null, null, null, null, ""];

const MODEL_HEADER_KEY = "x-goog-ext-525001261-jspb";

const Endpoint = Object.freeze({
  GOOGLE: "https://www.google.com",
  INIT: "https://gemini.google.com/app",
  GENERATE:
    "https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate",
  ROTATE_COOKIES: "https://accounts.google.com/RotateCookies",
  UPLOAD: "https://content-push.googleapis.com/upload",
  BATCH_EXEC: "https://gemini.google.com/_/BardChatUi/data/batchexecute",
});

const GRPC = Object.freeze({
  LIST_CHATS: "MaZiqc",
  READ_CHAT: "hNvQHb",
  DELETE_CHAT_1: "GzXR5e",
  DELETE_CHAT_2: "qWymEb",

  LIST_GEMS: "CNgdBe",
  CREATE_GEM: "oMH3Zd",
  UPDATE_GEM: "kHv0Vd",
  DELETE_GEM: "UXcSJb",

  DEEP_RESEARCH_STATUS: "kwDCne",
  DEEP_RESEARCH_PREFS: "L5adhe",
  DEEP_RESEARCH_BOOTSTRAP: "ku4Jyf",
  DEEP_RESEARCH_MODEL_STATE: "qpEbW",
  DEEP_RESEARCH_CAPS: "aPya6c",
  DEEP_RESEARCH_ACK: "PCck7e",

  GET_USER_STATUS: "otAQ7b",
  LIST_MODELS: "otAQ7b",
  GET_FULL_SIZE_IMAGE: "c8o8Fe",
  BARD_SETTINGS: "ESY5D",
});

const Headers = Object.freeze({
  REFERER: {
    Origin: "https://gemini.google.com",
    Referer: "https://gemini.google.com/",
  },
  SAME_DOMAIN: {
    "X-Same-Domain": "1",
  },
  GEMINI: {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    Origin: "https://gemini.google.com",
    Referer: "https://gemini.google.com/",
  },
  ROTATE_COOKIES: {
    "Content-Type": "application/json",
    Origin: "https://accounts.google.com",
  },
  UPLOAD: {"X-Tenant-Id": "bard-storage"},
  BATCH_EXEC: {
    "x-goog-ext-525001261-jspb": "[1,null,null,null,null,null,null,null,[4]]",
    "x-goog-ext-73010989-jspb": "[0]",
  },
});

// capacityTail: 1 = free, 2 = pro, 4 = plus.
function buildModelHeader(modelId, capacityTail) {
  return {
    [MODEL_HEADER_KEY]: `[1,null,null,null,"${modelId}",null,null,0,[4],null,null,${capacityTail}]`,
    "x-goog-ext-73010989-jspb": "[0]",
    "x-goog-ext-73010990-jspb": "[0]",
  };
}

const Models = Object.freeze({
  UNSPECIFIED: Object.freeze({
    modelName: "unspecified",
    modelHeader: {},
    advancedOnly: false,
  }),
  BASIC_PRO: Object.freeze({
    modelName: "gemini-3-pro",
    modelHeader: buildModelHeader("9d8ca3786ebdfbea", 1),
    advancedOnly: false,
  }),
  BASIC_FLASH: Object.freeze({
    modelName: "gemini-3-flash",
    modelHeader: buildModelHeader("fbb127bbb056c959", 1),
    advancedOnly: false,
  }),
  BASIC_THINKING: Object.freeze({
    modelName: "gemini-3-flash-thinking",
    modelHeader: buildModelHeader("5bf011840784117a", 1),
    advancedOnly: false,
  }),
  PLUS_PRO: Object.freeze({
    modelName: "gemini-3-pro-plus",
    modelHeader: buildModelHeader("e6fa609c3fa255c0", 4),
    advancedOnly: true,
  }),
  PLUS_FLASH: Object.freeze({
    modelName: "gemini-3-flash-plus",
    modelHeader: buildModelHeader("56fdd199312815e2", 4),
    advancedOnly: true,
  }),
  PLUS_THINKING: Object.freeze({
    modelName: "gemini-3-flash-thinking-plus",
    modelHeader: buildModelHeader("e051ce1aa80aa576", 4),
    advancedOnly: true,
  }),
  ADVANCED_PRO: Object.freeze({
    modelName: "gemini-3-pro-advanced",
    modelHeader: buildModelHeader("e6fa609c3fa255c0", 2),
    advancedOnly: true,
  }),
  ADVANCED_FLASH: Object.freeze({
    modelName: "gemini-3-flash-advanced",
    modelHeader: buildModelHeader("56fdd199312815e2", 2),
    advancedOnly: true,
  }),
  ADVANCED_THINKING: Object.freeze({
    modelName: "gemini-3-flash-thinking-advanced",
    modelHeader: buildModelHeader("e051ce1aa80aa576", 2),
    advancedOnly: true,
  }),
});

function modelFromName(name) {
  for (const model of Object.values(Models)) {
    if (model.modelName === name) return model;
  }
  const valid = Object.values(Models)
    .map((m) => m.modelName)
    .join(", ");
  throw new Error(`Unknown model name: ${name}. Available models: ${valid}`);
}

function modelFromDict(dict) {
  if (!dict || typeof dict !== "object") {
    throw new Error("Model dict must be an object");
  }
  if (!dict.modelName || !dict.modelHeader) {
    throw new Error(
      "Custom model dict must include `modelName` and `modelHeader` keys"
    );
  }
  if (typeof dict.modelHeader !== "object") {
    throw new Error("Custom model `modelHeader` must be an object");
  }
  return Object.freeze({
    modelName: dict.modelName,
    modelHeader: dict.modelHeader,
    advancedOnly: !!dict.advancedOnly,
  });
}

const AccountStatus = Object.freeze({
  AVAILABLE: {
    code: 1000,
    name: "AVAILABLE",
    description: "Account is authorized and has normal access.",
  },
  ACCESS_TEMPORARILY_UNAVAILABLE: {
    code: 1014,
    name: "ACCESS_TEMPORARILY_UNAVAILABLE",
    description:
      "Access is restricted, possibly due to regional or temporary session issues.",
  },
  UNAUTHENTICATED: {
    code: 1016,
    name: "UNAUTHENTICATED",
    description:
      "Session is not authenticated or cookies have expired. Please check your cookies.",
  },
  ACCOUNT_REJECTED: {
    code: 1021,
    name: "ACCOUNT_REJECTED",
    description:
      "Account access is rejected. Please check your Google Account settings.",
  },
  ACCOUNT_UNTRUSTED: {
    code: 1033,
    name: "ACCOUNT_UNTRUSTED",
    description:
      "Account did not pass safety or trust checks for some features.",
  },
  TOS_PENDING: {
    code: 1040,
    name: "TOS_PENDING",
    description:
      "You need to accept the latest Terms of Service to continue.",
  },
  TOS_OUT_OF_DATE: {
    code: 1042,
    name: "TOS_OUT_OF_DATE",
    description:
      "Terms of Service are out of date; please accept the new ones.",
  },
  ACCOUNT_REJECTED_BY_GUARDIAN: {
    code: 1054,
    name: "ACCOUNT_REJECTED_BY_GUARDIAN",
    description: "Access is blocked by a parent or guardian.",
  },
  GUARDIAN_APPROVAL_REQUIRED: {
    code: 1057,
    name: "GUARDIAN_APPROVAL_REQUIRED",
    description: "Access requires parent or guardian approval.",
  },
  LOCATION_REJECTED: {
    code: 1060,
    name: "LOCATION_REJECTED",
    description: "Gemini is not currently supported in your country/region.",
  },
});

function accountStatusFromCode(code) {
  if (code === null || code === undefined || code === 1000) {
    return AccountStatus.AVAILABLE;
  }
  for (const status of Object.values(AccountStatus)) {
    if (status.code === code) return status;
  }
  return AccountStatus.ACCOUNT_REJECTED;
}

const ErrorCode = Object.freeze({
  TEMPORARY_ERROR_1013: 1013,
  USAGE_LIMIT_EXCEEDED: 1037,
  MODEL_INCONSISTENT: 1050,
  MODEL_HEADER_INVALID: 1052,
  IP_TEMPORARILY_BLOCKED: 1060,
});

module.exports = {
  STREAMING_FLAG_INDEX,
  GEM_FLAG_INDEX,
  TEMPORARY_CHAT_FLAG_INDEX,
  CARD_CONTENT_RE,
  ARTIFACTS_RE,
  DEFAULT_METADATA,
  MODEL_HEADER_KEY,
  Endpoint,
  GRPC,
  Headers,
  buildModelHeader,
  Models,
  modelFromName,
  modelFromDict,
  AccountStatus,
  accountStatusFromCode,
  ErrorCode,
};
