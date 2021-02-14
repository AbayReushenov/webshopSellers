const { Schema, model, pluralize } = require('mongoose');

pluralize(null);

const deliverySchema = new Schema({
  done: Boolean,
  date: { type: Date, default: Date.now },
  good: { type: Schema.Types.ObjectId, ref: 'good' },
  seller: { type: Schema.Types.ObjectId, ref: 'seller' },
  quantity: Number,
});

module.exports = model('delivery', deliverySchema);
