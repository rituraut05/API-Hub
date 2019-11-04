var mongoose = require("mongoose");

var ModelReferenceSchema = new mongoose.Schema({
  service_id : mongoose.Schema.Types.ObjectId,
  model_name: String,
});

module.exports = mongoose.model('ModelReference', ModelReferenceSchema);