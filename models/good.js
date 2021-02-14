const { Schema, model, pluralize } = require('mongoose');

pluralize(null);

const goodSchema = new Schema({
  name: String,
  art: Number,
  pic: String,
  priceIn: Number,
});

module.exports = model('good', goodSchema);
