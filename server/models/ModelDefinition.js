var mongoose = require("mongoose");

var ModelDefinitionSchema = new mongoose.Schema({
  service_id : String,
  model_name: String,
  model_references: [mongoose.Schema.Types.ObjectId],
  model_obj: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('ModelDefinition', ModelDefinitionSchema);