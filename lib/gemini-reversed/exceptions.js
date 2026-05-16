class GeminiError extends Error {
  constructor(message) {
    super(message);
    this.name = "GeminiError";
  }
}

class AuthError extends GeminiError {
  constructor(message) {
    super(message);
    this.name = "AuthError";
  }
}

class APIError extends GeminiError {
  constructor(message) {
    super(message);
    this.name = "APIError";
  }
}

class ImageGenerationError extends APIError {
  constructor(message) {
    super(message);
    this.name = "ImageGenerationError";
  }
}

class TimeoutError extends GeminiError {
  constructor(message) {
    super(message);
    this.name = "TimeoutError";
  }
}

class UsageLimitExceeded extends GeminiError {
  constructor(message) {
    super(message);
    this.name = "UsageLimitExceeded";
  }
}

class ModelInvalid extends GeminiError {
  constructor(message) {
    super(message);
    this.name = "ModelInvalid";
  }
}

class TemporarilyBlocked extends GeminiError {
  constructor(message) {
    super(message);
    this.name = "TemporarilyBlocked";
  }
}

module.exports = {
  GeminiError,
  AuthError,
  APIError,
  ImageGenerationError,
  TimeoutError,
  UsageLimitExceeded,
  ModelInvalid,
  TemporarilyBlocked,
};
