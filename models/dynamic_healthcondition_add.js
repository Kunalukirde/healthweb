const mongoose = require('mongoose');
const getHealthModel = (collectionName) => {
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
        health_type_description: String,
        health_condition: String,
        healthCondition_description: String,
        health_name: String,
        health_name_description: String,
        title: String,
        image: Buffer,
        reviewed_by: String,
        content: [contentSchema],
    });

    // Return existing model if already defined
    if (mongoose.models[collectionName]) {
        return mongoose.model(collectionName); // Use existing model
    }

    // Explicitly set the collection name to avoid pluralization
    return mongoose.model(collectionName, healthSchema, collectionName);
};

module.exports = getHealthModel;


