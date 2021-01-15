const router = require('express').Router();
const Trip = require('../models/tripModel');
const Location = require('../models/locationModel');
const SharedTrip = require('../models/sharedTripModel');
const LocationNote = require('../models/locationNoteModel');

router.get('/myTrips/:userId', async (req, res) => {
  try {
    // needs error handling
    const { userId } = req.params;
    const myTrips = await Trip.find({'user': userId})
      .populate('user', 'username email');
    res.json(myTrips);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.get('/public', async (req, res) => {
  try {
    // needs error handling
    const publicTrips = await Trip.find({'published': true})
      .populate('user', 'username email');
    res.json(publicTrips);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.get('/:tripId', async (req, res) => {
  try {
    // needs error handling
    const { tripId } = req.params;
    const trip = await Trip.findById(tripId)
      .populate('user', 'username email');
    res.json(trip);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.delete('/delete/:tripId', async (req, res) => {
  try {
    // needs error handling
    const { tripId} = req.params;
    let deletedLocationNoteCount = 0;
    const tripLocations = await Location.find({'tripId': tripId});
    
    await tripLocations.forEach(async (location) => {
      const deletedNotes = await LocationNote.deleteMany({'locationId': location._id});
      deletedLocationNoteCount += deletedNotes.deletedCount;
    });

    const deletedLocations = await Location.deleteMany({'tripId': tripId});

    const deletedTrip = await Trip.findByIdAndDelete(tripId);
    res.json({
      'trip' : deletedTrip,
      'deletedLocationCount' : deletedLocations.deletedCount,
      'deletedLocationNotesCount' : deletedLocationNoteCount
    });
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.patch('/update', async (req, res) => {
  try {
    // needs error handling
    const trip = req.body;
    const tripOld = await Trip.findByIdAndUpdate(trip._id, trip)
    const updatedTrip = await Trip.findById(trip._id)
      .populate('user', 'username email');
    res.json(updatedTrip);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.patch('/location/update', async (req, res) => {
  try {
    // needs error handling
    const location = req.body;
    console.log(location, 'loc');
    const locationOld = await Location.findByIdAndUpdate(location._id, location)
    const updatedLocation = await Location.findById(location._id);
    res.json(updatedLocation);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.delete('/location/delete/:locationId', async (req, res) => {
  try {
    // needs error handling
    const { locationId } = req.params;
    const deletedNotes = await LocationNote.deleteMany({'locationId' : locationId});
    const deletedLocation = await Location.findByIdAndDelete(locationId);
    res.json({
      'location': deletedLocation,
      'locationNoteCount' : deletedNotes.deletedCount
    });
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.get('/locations/:tripId', async (req, res) => {
  try {
    // needs error handling
    const { tripId } = req.params;
    const hasQuery = Object.keys(req.query).length > 0;
    if (hasQuery) {
      const star = req.query.star;
      const locationTypeId = req.query.locationTypeId;
      if (star) {
        const tripLocations = await Location.find({
          'trip' : tripId,
          star
        });
        res.json(tripLocations);
      }
      if (locationTypeId) {
        const tripLocations = await Location.find({
          'trip' : tripId,
          'locationType.id' : parseInt(locationTypeId)
        });
        res.json(tripLocations);
      }
    } else {
      const tripLocations = await Location.find({"trip" : tripId });
      res.json(tripLocations);
    }
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.get('/locationNotes/:locationId', async (req, res) => {
  try {
    // needs error handling
    const { locationId } = req.params;
    const locationNotes = await LocationNote.find({'locationId' : locationId});
    res.json(locationNotes);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.get('/locationNote/:noteId', async (req, res) => {
  try {
    // needs error handling
    const { noteId } = req.params;
    const locationNote = await LocationNote.findById(noteId);
    res.json(locationNote);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.patch('/locationNote/:noteId', async (req, res) => {
  try {
    // needs error handling
    const { noteId } = req.params;
    const locationNote = req.body;
    const locationNoteOld = await LocationNote.findByIdAndUpdate(noteId, locationNote);
    const updatedLocationNote = await LocationNote.findById(noteId);
    res.json(updatedLocationNote);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.post('/locationNote', async (req, res) => {
  try {
    // needs error handling
    const locationNote = req.body;
    const newLocationNote = new LocationNote(locationNote);
    const savedLocationNote = await newLocationNote.save();
    res.json(savedLocationNote);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.delete('/locationNote/:noteId', async (req, res) => {
  try {
    // needs error handling
    const { noteId } = req.params;
    const deletedLocationNote = await LocationNote.findByIdAndDelete(noteId);
    res.json(deletedLocationNote);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.post('/locations', async (req, res) => {
  try {
    // needs error handling
    const location = req.body;
    const newLocation = new Location(location);
    const savedLocation = await newLocation.save();
    res.json(savedLocation);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.post('/', async (req, res) => {
  try {
    // needs error handling
    const trip = req.body;
    const newTrip = new Trip(trip)
    const savedTrip = await newTrip.save();
    res.json(savedTrip);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.get('/sharedTrips/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const sharedTrips = await SharedTrip.find({'friendEmail' : email})
      .populate('trip')
      .populate('user', 'email username');
      res.json(sharedTrips);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.get('/tripShares/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;
    const tripShares = await SharedTrip.find({'trip' : tripId})
      .populate('trip')
      .populate('user', 'email username');
    res.json(tripShares);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.post('/sharedTrip', async (req, res) => {
  try {
    const sharedTrip = req.body;
    const newSharedTrip = new SharedTrip(sharedTrip);
    const savedSharedTrip = await newSharedTrip.save();
    res.json(savedSharedTrip);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.delete('/sharedTrips/:sharedTripId', async (req, res) => {
  try {
    const { sharedTripId } = req.params;
    const deletedTrip = await SharedTrip.findByIdAndDelete(sharedTripId);
    res.json(deletedTrip);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

module.exports = router;