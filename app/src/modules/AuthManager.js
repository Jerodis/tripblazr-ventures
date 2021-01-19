// This is the page that will call the API calls for the authentication
const remoteURL = 'https://api-dot-tb-ventures.uc.r.appspot.com/users';
// const remoteURL = 'http://localhost:5000/users';

export default {
	getUser(userName) {
		return fetch(`${remoteURL}/users?userName=${userName}`).then(result =>
			result.json()
		);
	},
	registerUser(user) { // express
		return fetch(`${remoteURL}/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(user)
		}).then(Response => Response.json());
  },
  async login(user) { // express
    return fetch(`${remoteURL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
  },
  async checkUserVerified(token) { // express
    return fetch(`${remoteURL}/tokenIsValid`, {
      method: 'POST',
      headers: { 'x-auth-token': token },
      body: null
    });
  },
  async getCurrentUser(token) { // express
    return fetch(`${remoteURL}/`, {
      headers: {
        'x-auth-token': token
      },
      body: null
    });
  },
	// createUser(user) {
	// 	return fetch(`${remoteURL}/users/`, {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify(user)
	// 	}).then(Response => Response.json());
	// },
	getUserById(id) {
		return fetch(`${remoteURL}/users/${id}`).then(result => result.json());
	}
};
