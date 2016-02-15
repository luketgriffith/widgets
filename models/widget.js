var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WidgetSchema = new Schema({
  name: String,
  price: Number,
  color: String,
  inventory: Number,
  melts: Boolean
});

module.exports = mongoose.model('Widget', WidgetSchema);