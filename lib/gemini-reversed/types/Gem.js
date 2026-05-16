class Gem {
  constructor({id, name, description = null, prompt = null, predefined = false}) {
    if (!id) throw new Error("Gem: `id` is required");
    if (!name) throw new Error("Gem: `name` is required");
    this.id = id;
    this.name = name;
    this.description = description;
    this.prompt = prompt;
    this.predefined = predefined;
  }

  toString() {
    return `Gem(id=${JSON.stringify(this.id)}, name=${JSON.stringify(this.name)}, predefined=${this.predefined})`;
  }
}

class GemJar {
  constructor(entries = []) {
    this._map = new Map();
    if (entries instanceof Map) {
      for (const [id, gem] of entries.entries()) this._map.set(id, gem);
    } else if (Array.isArray(entries)) {
      for (const entry of entries) {
        if (Array.isArray(entry) && entry.length === 2) {
          this._map.set(entry[0], entry[1]);
        } else if (entry instanceof Gem) {
          this._map.set(entry.id, entry);
        }
      }
    }
  }

  set(id, gem) {
    this._map.set(id, gem);
    return this;
  }

  get({id = null, name = null, fallback = null} = {}) {
    if (id == null && name == null) {
      throw new Error("GemJar.get requires `id` or `name`");
    }
    if (id != null) {
      const candidate = this._map.get(id);
      if (!candidate) return fallback;
      if (name != null && candidate.name !== name) return fallback;
      return candidate;
    }
    for (const gem of this._map.values()) {
      if (gem.name === name) return gem;
    }
    return fallback;
  }

  filter({predefined = null, name = null} = {}) {
    const jar = new GemJar();
    for (const [id, gem] of this._map.entries()) {
      if (predefined !== null && gem.predefined !== predefined) continue;
      if (name !== null && gem.name !== name) continue;
      jar.set(id, gem);
    }
    return jar;
  }

  values() {
    return [...this._map.values()];
  }

  ids() {
    return [...this._map.keys()];
  }

  *[Symbol.iterator]() {
    for (const gem of this._map.values()) yield gem;
  }

  get size() {
    return this._map.size;
  }
}

module.exports = {Gem, GemJar};
