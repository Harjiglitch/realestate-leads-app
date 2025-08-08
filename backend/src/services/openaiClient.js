const { Configuration, OpenAIApi } = require('openai');
const { OPENAI_KEY } = require('../config');
if (!OPENAI_KEY) {
  module.exports = null;
} else {
  const cfg = new Configuration({ apiKey: OPENAI_KEY });
  module.exports = new OpenAIApi(cfg);
}
