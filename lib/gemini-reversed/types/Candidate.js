function decodeHtml(text) {
  if (!text) return text;
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

class Candidate {
  constructor({
    rcid,
    text = "",
    textDelta = null,
    thoughts = null,
    thoughtsDelta = null,
    webImages = [],
    generatedImages = [],
    generatedVideos = [],
    generatedMedia = [],
    deepResearchPlan = null,
  }) {
    if (!rcid) throw new Error("Candidate: `rcid` is required");
    this.rcid = rcid;
    this.text = decodeHtml(text);
    this.textDelta = textDelta;
    this.thoughts = decodeHtml(thoughts);
    this.thoughtsDelta = thoughtsDelta;
    this.webImages = webImages;
    this.generatedImages = generatedImages;
    this.generatedVideos = generatedVideos;
    this.generatedMedia = generatedMedia;
    this.deepResearchPlan = deepResearchPlan;
  }

  get images() {
    return [...this.webImages, ...this.generatedImages];
  }

  toString() {
    const preview = (this.text || "").slice(0, 100);
    return `Candidate(rcid=${JSON.stringify(this.rcid)}, text=${JSON.stringify(preview)})`;
  }
}

module.exports = {Candidate};
