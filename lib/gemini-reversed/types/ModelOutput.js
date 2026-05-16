class ModelOutput {
  constructor({metadata = [], candidates = [], chosen = 0, resolvedModel = null}) {
    this.metadata = metadata;
    this.candidates = candidates;
    this.chosen = chosen;
    // The model the server actually used for this turn. May differ from
    // the requested model when the server downgrades (e.g. PLUS_THINKING →
    // BASIC_THINKING when the account hits a rate limit). Shape:
    //   { modelId: "5bf011840784117a", modelName: "gemini-3-flash-thinking" }
    this.resolvedModel = resolvedModel;
  }

  _chosen() {
    if (!this.candidates.length) return null;
    return this.candidates[this.chosen] || null;
  }

  get rcid() {
    return this._chosen()?.rcid || "";
  }

  get text() {
    return this._chosen()?.text || "";
  }

  get textDelta() {
    return this._chosen()?.textDelta || "";
  }

  get thoughts() {
    return this._chosen()?.thoughts || null;
  }

  get thoughtsDelta() {
    return this._chosen()?.thoughtsDelta || "";
  }

  get images() {
    return this._chosen()?.images || [];
  }

  get videos() {
    return this._chosen()?.generatedVideos || [];
  }

  get media() {
    return this._chosen()?.generatedMedia || [];
  }

  get deepResearchPlan() {
    return this._chosen()?.deepResearchPlan || null;
  }

  toString() {
    return (this.text || "").slice(0, 100);
  }
}

module.exports = {ModelOutput};
