const { Schema, model, pluralize } = require('mongoose');

pluralize(null);

const buyerSchema = new Schema({
  name: String,
  login: String,
  password: String,
});

module.exports = model('buyer', buyerSchema);
