class ChatTurn {
  constructor({role, text = "", modelOutput = null}) {
    if (!role) throw new Error("ChatTurn: `role` is required");
    this.role = role;
    this.text = text;
    this.modelOutput = modelOutput;
  }

  toString() {
    return `${this.role.toUpperCase()}: ${(this.text || "").slice(0, 100)}`;
  }
}

class ChatHistory {
  constructor({cid, turns = []}) {
    if (!cid) throw new Error("ChatHistory: `cid` is required");
    this.cid = cid;
    this.turns = turns;
  }

  toString() {
    return `ChatHistory(cid=${JSON.stringify(this.cid)}, turns=${this.turns.length})`;
  }
}

class ChatInfo {
  constructor({cid, title = "", isPinned = false, timestamp = 0}) {
    if (!cid) throw new Error("ChatInfo: `cid` is required");
    this.cid = cid;
    this.title = title;
    this.isPinned = isPinned;
    this.timestamp = timestamp;
  }

  toString() {
    const pin = this.isPinned ? "[Pinned] " : "";
    const title = this.title || `Chat(${this.cid})`;
    return `${pin}${title}`;
  }
}

module.exports = {ChatTurn, ChatHistory, ChatInfo};
