const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  main_title: String,
  topic_heading: String,
  topic_title: String,
  topic_description: String,
  topic_paragraph: String,
  topic_facts: String,
});

const healthSchema = new mongoose.Schema({
  health_type: String,
  health_type_description:String,
  health_condition: String,
  healthCondition_description:String,
  health_name: String,
  health_name_description:String,
  title: String,
  image: Buffer,
  reviewed_by: String,
  content: [contentSchema], // Embedding an array of topics within the health document
});

const HealthModel = mongoose.model('Health', healthSchema);

module.exports = HealthModel;
