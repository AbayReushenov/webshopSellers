const { Schema, model, pluralize } = require('mongoose');

pluralize(null);

const storeSchema = new Schema({
  good: { type: Schema.Types.ObjectId, ref: 'good' },
  quantity: Number,
});

module.exports = model('store', storeSchema);
