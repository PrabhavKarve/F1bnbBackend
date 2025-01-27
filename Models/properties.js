const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const propertySchema = new mongoose.Schema({
  property_name: {
    type: String,
    required: true
  },
  property_id: {
    type: Number, // Changed to Number for auto-increment
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  no_of_guests: {
    type: Number,
    required: true
  },
  no_of_bedrooms: {
    type: Number,
    required: true
  },
  no_of_bed: {
    type: Number,
    required: true
  },
  no_of_bath: {
    type: Number,
    required: true
  },
  about: {
    type: String,
    required: true
  },
  amenities: {
    type: [String],
    required: true
  },
  price_per_night: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  // Change this to an array of strings
  images: {
    type: [String],
    required: true
  },
});

// Apply the auto-increment plugin to the schema
propertySchema.plugin(AutoIncrement, { inc_field: 'property_id' });

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
