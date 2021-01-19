// This is the page that will call the API calls for the authentication
const remoteURL = 'https://api-dot-tb-ventures.uc.r.appspot.com/trips';
// const remoteURL = 'http://localhost:5000/trips';

export default {
	// getAllTrips(id) {
	// 	return fetch(`${remoteURL}/trips?userId=${id}`).then(result =>
	// 		result.json()
	// 	);
	// },
	async getMyTrips(userId) { // express
		return fetch(`${remoteURL}/mytrips/${userId}`);
	},
	async getAllPublicTrips() { // express
		return fetch(`${remoteURL}/public`);
	},
	// getAllPublicTrips() {
	// 	return fetch(`${remoteURL}/trips?published=true&_expand=user`).then(
	// 		result => result.json()
	// 	);
	// },
  async getTripLocations(tripId) { // express
		return fetch(`${remoteURL}/locations/${tripId}`);
	},
	// getTrip(id) {
	// 	return fetch(
	// 		`${remoteURL}/locations?tripId=${id}&_expand=locationType&_embed=locationNotes`
	// 	).then(result => result.json());
	// },
	async getTripDetails(id) { // express
		return fetch(`${remoteURL}/${id}`);
	},
	// getTripDetails(id) {
	// 	return fetch(`${remoteURL}/trips?id=${id}&_embed=sharedTrips`).then(
	// 		result => result.json()
	// 	);
	// },
	async getTripByType(tripId, typeId) {
		return fetch(`${remoteURL}/locations/${tripId}?locationTypeId=${typeId}`);
	},
	// getTripByType(id, typeId) {
	// 	return fetch(
	// 		`${remoteURL}/locations?tripId=${id}&locationTypeId=${typeId}&_expand=locationType&_embed=locationNotes`
	// 	).then(result => result.json());
	// },
	async deleteTrip(tripId) { // express
		return fetch(`${remoteURL}/delete/${tripId}`, {
			method: 'DELETE'
		});
	},
	// deleteTrip(id) {
	// 	return fetch(`${remoteURL}/trips/${id}`, {
	// 		method: 'DELETE'
	// 	}).then(result => result.json());
	// },

	//attempt to batch delete, DOES NOT WORK
	deleteTripLocations(id) {
		return fetch(`${remoteURL}/locations?tripId=${id}`, {
			method: 'DELETE'
		}).then(result => result.json());
	},
	async deleteLocation(locationId) { // express
		return fetch(`${remoteURL}/location/delete/${locationId}`, {
			method: 'DELETE'
		});
	},
	// deleteLocation(id) {
	// 	return fetch(`${remoteURL}/locations/${id}`, {
	// 		method: 'DELETE'
	// 	}).then(result => result.json());
	// },
	async postTrip(newTrip) { // express
		return fetch(`${remoteURL}/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newTrip)
		});
	},
	// postTrip(newTrip) {
	// 	return fetch(`${remoteURL}/trips`, {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify(newTrip)
	// 	}).then(data => data.json());
	// },
	async updateTrip(editedTrip) { // express
		return fetch(`${remoteURL}/update`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(editedTrip) 
		});
	},
	// updateTrip(editedTrip) {
	// 	return fetch(`${remoteURL}/trips/${editedTrip.id}`, {
	// 		method: 'PATCH',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify(editedTrip)
	// 	}).then(data => data.json());
	// },
  async postLocation(newLocation) { // express
		return fetch(`${remoteURL}/locations`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newLocation)
		});
	},
	// postLocation(newLocation) {
	// 	return fetch(`${remoteURL}/locations`, {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify(newLocation)
	// 	}).then(data => data.json());
	// },
  async updateLocation(location) { // express
		return fetch(`${remoteURL}/location/update`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(location)
		});
	},
	// updateLocation(editedLocation) {
	// 	return fetch(`${remoteURL}/locations/${editedLocation.id}`, {
	// 		method: 'PATCH',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify(editedLocation)
	// 	}).then(data => data.json());
	// },
	async getStarTrip(tripId) { // express
		return fetch(`${remoteURL}/locations/${tripId}?star=true`);
	},
	// getStarTrip(id) {
	// 	return fetch(
	// 		`${remoteURL}/locations?tripId=${id}&star=true&_expand=locationType&_embed=locationNotes`
	// 	).then(result => result.json());
	// },
	async getLocationNotes(locationId) { // express
		return fetch(`${remoteURL}/locationNotes/${locationId}`);
	},
	// getLocationNotes(id) {
	// 	return fetch(
	// 		`${remoteURL}/locationNotes?locationId=${id}&_sort=date&_order=desc&_expand=user`
	// 	).then(result => result.json());
	// },
	async getLocationNote(noteId) { // express
		return fetch(`${remoteURL}/locationNote/${noteId}`);
	},
	// getLocationNote(id) {
	// 	return fetch(`${remoteURL}/locationNotes/${id}`).then(result =>
	// 		result.json()
	// 	);
	// },
	async deleteLocationNote(noteId) { // express
		return fetch(`${remoteURL}/locationNote/${noteId}`, {
			method: 'DELETE'
		});
	},
	// deleteLocationNote(id) {
	// 	return fetch(`${remoteURL}/locationNotes/${id}`, {
	// 		method: 'DELETE'
	// 	}).then(result => result.json());
	// },
	postLocationNote(newNote) { // express
		return fetch(`${remoteURL}/locationNote`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newNote)
		});
	},
	// postLocationNote(newNote) {
	// 	return fetch(`${remoteURL}/locationNotes`, {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify(newNote)
	// 	}).then(data => data.json());
	// },
	updateLocationNote(editedLocationNote) { // express
		return fetch(`${remoteURL}/locationNote/${editedLocationNote._id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(editedLocationNote)
		});
	},
	// updateLocationNote(editedLocationNote) {
	// 	return fetch(`${remoteURL}/locationNotes/${editedLocationNote.id}`, {
	// 		method: 'PATCH',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify(editedLocationNote)
	// 	}).then(data => data.json());
	// },
	async getSharedTrips(userEmail) { // express
		return fetch(
			`${remoteURL}/sharedTrips/${userEmail}`);
	},
	// getSharedTrips(userEmail) {
	// 	return fetch(
	// 		`${remoteURL}/sharedTrips?friendEmail=${userEmail}&_expand=trip&_expand=user`
	// 	).then(result => result.json());
	// },
	async getTripShares(tripId) { // express
		return fetch(`${remoteURL}/tripShares/${tripId}`);
	},
	// getTripsShares(tripId) {
	// 	return fetch(`${remoteURL}/sharedTrips?tripId=${tripId}`).then(result =>
	// 		result.json()
	// 	);
	// },
	postTripShare(newShare) { // express
		return fetch(`${remoteURL}/sharedTrip`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newShare)
		});
	},
	// postTripShare(newShare) {
	// 	return fetch(`${remoteURL}/sharedTrips`, {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify(newShare)
	// 	}).then(data => data.json());
	// },
	deleteTripShare(id) { // express
		return fetch(`${remoteURL}/sharedTrips/${id}`, {
			method: 'DELETE'
		});
	}
	// deleteTripShare(id) {
	// 	return fetch(`${remoteURL}/sharedTrips/${id}`, {
	// 		method: 'DELETE'
	// 	}).then(result => result.json());
	// }
};
