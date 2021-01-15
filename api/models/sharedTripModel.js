const mongoose = require('mongoose');

const sharedTripSchema = new mongoose.Schema({
  friendEmail: {type: String, required: true},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'trip'
  },
  loadingStatus: {type: Boolean, default: false}
});

module.exports = SharedTrip = mongoose.model('sharedTrip', sharedTripSchema);
