const mongoose = require('mongoose');

const sharedTripSchema = new mongoose.Schema({
  friendEmail: {type: String, required: true},
  userId: {type: String, required: true},
  tripId: {type: String},
  loadingStatus: {type: Boolean, default: false}
});

module.exports = SharedTrip = mongoose.model('sharedTrip', sharedTripSchema);
