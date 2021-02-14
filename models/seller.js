const { Schema, model, pluralize } = require('mongoose');

pluralize(null);

const sellerSchema = new Schema({
  name: String,
  login: String,
  password: String,
});
module.exports = model('seller', sellerSchema);
