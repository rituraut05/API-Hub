var mongoose = require("mongoose");

var ServiceDefinitionSchema = new mongoose.Schema({
  service_name: String,
  version: String,
  description: String
});

module.exports = mongoose.model('ServiceDefinition', ServiceDefinitionSchema);