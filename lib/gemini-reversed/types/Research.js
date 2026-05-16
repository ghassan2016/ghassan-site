class DeepResearchPlan {
  constructor({
    researchId = null,
    title = null,
    query = null,
    steps = [],
    etaText = null,
    confirmPrompt = null,
    modifyPrompt = null,
    confirmationUrl = null,
    metadata = [],
    cid = null,
    responseText = null,
    rawState = null,
  } = {}) {
    this.researchId = researchId;
    this.title = title;
    this.query = query;
    this.steps = steps;
    this.etaText = etaText;
    this.confirmPrompt = confirmPrompt;
    this.modifyPrompt = modifyPrompt;
    this.confirmationUrl = confirmationUrl;
    this.metadata = metadata;
    this.cid = cid;
    this.responseText = responseText;
    this.rawState = rawState;
  }
}

class DeepResearchStatus {
  constructor({
    researchId,
    state = "running",
    title = null,
    query = null,
    cid = null,
    notes = [],
    done = false,
    rawState = null,
    raw = null,
  }) {
    if (!researchId) throw new Error("DeepResearchStatus: `researchId` is required");
    this.researchId = researchId;
    this.state = state;
    this.title = title;
    this.query = query;
    this.cid = cid;
    this.notes = notes;
    this.done = done;
    this.rawState = rawState;
    this.raw = raw;
  }
}

class DeepResearchResult {
  constructor({
    plan,
    startOutput = null,
    finalOutput = null,
    statuses = [],
    done = false,
  }) {
    this.plan = plan;
    this.startOutput = startOutput;
    this.finalOutput = finalOutput;
    this.statuses = statuses;
    this.done = done;
  }

  get text() {
    return this.finalOutput?.text || "";
  }
}

module.exports = {DeepResearchPlan, DeepResearchStatus, DeepResearchResult};
