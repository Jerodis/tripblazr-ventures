const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  name: {type: String, required: true},
  userId: {type: String, required: true},
  summary: {type: String},
  communication: {type: String},
  money: {type: String},
  published: {type: Boolean, default: false},
  lng: {type: Number},
  lat: {type: Number},
  likes: {type: Number},
  city: {type: String},
  loadingState: {type: Boolean, default: false}
});

module.exports = Trip = mongoose.model('trip', tripSchema);
