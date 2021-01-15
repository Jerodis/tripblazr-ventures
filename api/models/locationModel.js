const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'trip'
  },
  summary: {type: String},
  lng: {type: Number},
  lat: {type: Number},
  address: {type: String},
  price: {type: Number},
  likes: {type: Number},
  locationType: {type: {
    id: {type: Number},
    name: {type: String}
    },
  },
  name: {type: String, required: true},
  url: {type: String},
  star: {type: Boolean, default: false}
});

module.exports = Location = mongoose.model('location', locationSchema);
