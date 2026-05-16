class RPCData {
  constructor({rpcid, payload, identifier = "generic"}) {
    if (!rpcid) throw new Error("RPCData: `rpcid` is required");
    if (typeof payload !== "string") {
      throw new Error("RPCData: `payload` must be a JSON string");
    }
    this.rpcid = rpcid;
    this.payload = payload;
    this.identifier = identifier;
  }

  serialize() {
    return [this.rpcid, this.payload, null, this.identifier];
  }
}

module.exports = {RPCData};
