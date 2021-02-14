const { Schema, model, pluralize } = require('mongoose');

pluralize(null);

const buscetSchema = new Schema({
  done: Boolean,
  date: { type: Date, default: Date.now },
  good: { type: Schema.Types.ObjectId, ref: 'good' },
  buyer: { type: Schema.Types.ObjectId, ref: 'buyer' },
  quantity: Number,
});

module.exports = model('buscet', buscetSchema);
