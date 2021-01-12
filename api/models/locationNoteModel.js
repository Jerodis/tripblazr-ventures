const mongoose = require('mongoose');

const locationNoteSchema = new mongoose.Schema({
  title: {type: String, required: true},
  locationId: {type: String, required: true},
  postedDate: {type: Date},
  note: {type: String},
  userId: {type: String},
  editTimeStamp: {type: Date},
  type: {type: String}
});

module.exports = LocationNote = mongoose.model('locationNote', locationNoteSchema);
