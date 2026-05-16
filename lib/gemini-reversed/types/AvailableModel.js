const {buildModelHeader, MODEL_HEADER_KEY, Models} = require("../constants");
const {getNestedValue} = require("../http/parsing");

class AvailableModel {
  constructor({
    modelId,
    modelName,
    displayName,
    description,
    capacity,
    capacityField = 12,
    isAvailable = true,
  }) {
    if (!modelId) throw new Error("AvailableModel: `modelId` is required");
    this.modelId = modelId;
    this.modelName = modelName;
    this.displayName = displayName;
    this.description = description;
    this.capacity = capacity;
    this.capacityField = capacityField;
    this.isAvailable = isAvailable;
  }

  // capacityField=13 uses a "null,N" tail; everything else is plain "N".
  get modelHeader() {
    const tail = this.capacityField === 13 ? `null,${this.capacity}` : String(this.capacity);
    return buildModelHeader(this.modelId, tail);
  }

  get advancedOnly() {
    return !(this.capacity === 1 && this.capacityField === 12);
  }

  toString() {
    return this.modelName || this.displayName;
  }

  static computeCapacity(tierFlags = [], capabilityFlags = []) {
    if (tierFlags.includes(21)) return [1, 13];
    if (tierFlags.includes(22)) return [2, 13];

    if (capabilityFlags.includes(115)) return [4, 12]; // Plus
    if (tierFlags.includes(16) || capabilityFlags.includes(106)) return [3, 12];
    if (
      tierFlags.includes(8) ||
      (!capabilityFlags.includes(106) && capabilityFlags.includes(19))
    ) {
      return [2, 12]; // Pro
    }
    return [1, 12]; // Free
  }

  static buildModelIdNameMapping() {
    const result = {};
    for (const [key, member] of Object.entries(Models)) {
      if (key === "UNSPECIFIED") continue;
      const headerValue = member.modelHeader[MODEL_HEADER_KEY];
      if (!headerValue) continue;
      let parsed;
      try {
        parsed = JSON.parse(headerValue);
      } catch {
        continue;
      }
      const modelId = getNestedValue(parsed, [4]);
      if (modelId && !(modelId in result)) {
        const baseKey = "BASIC_" + key.split("_").slice(1).join("_");
        const baseMember = Models[baseKey] || member;
        result[modelId] = baseMember.modelName;
      }
    }
    return result;
  }
}

module.exports = {AvailableModel};
