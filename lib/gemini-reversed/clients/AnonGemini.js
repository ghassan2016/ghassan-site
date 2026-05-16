const {BaseGemini} = require("./BaseGemini");

class AnonGemini extends BaseGemini {
  constructor({proxy = null, verbose = false} = {}) {
    super({proxy, verbose});
  }
}

module.exports = {AnonGemini};
