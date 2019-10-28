import React, { Component } from 'react';
import { Map, TileLayer, Marker, Tooltip } from 'react-leaflet';
import Token from '../../Token';
import L from 'leaflet';
import GeoSearch from './GeoSearch';
import Control from 'react-leaflet-control';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import SearchManager from '../../modules/SearchManager';

const createClusterCustomIcon = function(cluster) {
	return L.divIcon({
		html: `<span>${cluster.getChildCount()}</span>`,
		className: 'marker-cluster-custom',
		iconSize: L.point(40, 40, true)
	});
};

const myIcon1 = L.icon({
	iconUrl: '/images/markers/icon1.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	tooltipAnchor: [15, -30],
	shadowUrl: '/images/markers/shadow.png',
	shadowSize: [30, 41],
	shadowAnchor: [9, 41]
});

const myIcon2 = L.icon({
	iconUrl: '/images/markers/icon2.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	tooltipAnchor: [15, -30],
	shadowUrl: '/images/markers/shadow.png',
	shadowSize: [30, 41],
	shadowAnchor: [9, 41]
});

const myIcon3 = L.icon({
	iconUrl: '/images/markers/icon3.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	tooltipAnchor: [15, -30],
	shadowUrl: '/images/markers/shadow.png',
	shadowSize: [30, 41],
	shadowAnchor: [9, 41]
	// className: 'toolTip'
});

const myIcon4 = L.icon({
	iconUrl: '/images/markers/icon4.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	tooltipAnchor: [15, -30],
	shadowUrl: '/images/markers/shadow.png',
	shadowSize: [30, 41],
	shadowAnchor: [9, 41]
});

const myIcon5 = L.icon({
	iconUrl: '/images/markers/icon5.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	tooltipAnchor: [15, -30],
	shadowUrl: '/images/markers/shadow.png',
	shadowSize: [30, 41],
	shadowAnchor: [9, 41]
});

export default class Mapper extends Component {
	state = {
		lat: '',
		lng: '',
		zoom: 14,
		light: true,
		searchResults: [],
		tripView: true,
		searchTerm: '',
		searchRange: 2000,
		stars: '3'
	};

	//function for storing click events on geosearch and click to add markers
	storeGeocode = (e, obj) => {
		console.log('yaya got dem O-B-Js', obj);
	};

	//function to storing click events on main map

	markerFocus = (e, obj) => {
		console.log('got the deets', obj);
	};

	//light and dark mode on map

	mapToggle = () => {
		if (this.state.light === true) {
			this.setState({
				light: false
			});
		} else {
			this.setState({
				light: true
			});
		}
	};

	//attempt to get map center bounds for FB search _lastCenter doesnt seem to be accurate

	getCenterCoords = e => {
		console.log(this.leafletMap.leafletElement);
	};

	//toggle FB search and geocode search
	searchToggle = () => {
		if (this.state.tripView === true) {
			this.setState({
				tripView: false
			});
		} else {
			this.setState({
				tripView: true
			});
		}
	};

	//fetch FB places

	fetchFbData = () => {
		if (this.state.lat === '') {
			alert('drop a pin so we know where to search!');
		} else {
			let searchTerm = document.querySelector('#searchTerm').value;

			SearchManager.FbSearch(
				searchTerm,
				this.state.lat,
				this.state.lng,
				this.state.searchRange
			).then(results => {
				let searchResults = results.data;
				let filteredResults = [];

				searchResults.forEach(obj => {
					console.log(document.querySelector('#stars').value);
					if (document.querySelector('#stars').value < 1) {
						filteredResults.push(obj);
					} else if (
						obj.overall_star_rating >= document.querySelector('#stars').value
					) {
						filteredResults.push(obj);
					}
				});
				this.setState({
					searchResults: filteredResults
				});
				console.log(this.state.searchResults);
			});
		}
	};

	handleFieldChange = evt => {
		const stateToChange = {};
		stateToChange[evt.target.id] = evt.target.value;
		this.setState(stateToChange);
	};

	handleChange = e => {
		this.setState({ searchRange: e.target.value });
	};

	//drop marker on click and record coords and address
	componentDidMount() {
		console.log('trip deets from trip at didmount', this.props.tripDetails);

		const map = this.leafletMap.leafletElement;
		const geocoder = L.Control.Geocoder.mapbox(Token);
		let marker;

		map.on('click', e => {
			geocoder.reverse(
				e.latlng,
				map.options.crs.scale(map.getZoom()),
				results => {
					var r = results[0];
					console.log('reverse geocode results', r);
					this.setState({
						lat: r.center.lat,
						lng: r.center.lng
					});
					console.log(this.state.lat, this.state.lng);
					if (r) {
						if (marker) {
							marker
								.setLatLng(r.center)
								.bindTooltip(r.name, { className: 'toolTip' })
								.on('click', e => this.storeGeocode(e, r));
							// .openPopup();
						} else {
							marker = L.marker(r.center, { icon: myIcon4 })
								.bindTooltip(r.name, { className: 'toolTip' })
								.addTo(map)
								.on('click', e => this.storeGeocode(e, r));
							// .openPopup();
						}
					}
				}
			);
		});
	}

	configMyIcon = id => {
		if (id === 1) {
			return myIcon1;
		} else if (id === 2) {
			return myIcon2;
		} else if (id === 3) {
			return myIcon3;
		} else return myIcon5;
	};

	getCoord = e => {
		const lat = e.latlng.lat;
		const lng = e.latlng.lng;
		console.log(lat, lng);
	};
	//mapbox://styles/jerodis/ck24x2b5a12ro1cnzdopvyw08 light
	//mapbox://styles/jerodis/ck24wv71g15vb1cp90thseofp dark
	render() {
		console.log('trip deets from trip at render', this.props.tripDetails);
		let Atoken;
		if (this.state.light === true) {
			Atoken = `https://api.mapbox.com/styles/v1/jerodis/ck24x2b5a12ro1cnzdopvyw08/tiles/256/{z}/{x}/{y}@2x?access_token=${Token.MB}`;
		} else {
			Atoken = `https://api.mapbox.com/styles/v1/jerodis/ck24wv71g15vb1cp90thseofp/tiles/256/{z}/{x}/{y}@2x?access_token=${Token.MB}`;
		}

		const position = [this.state.lat, this.state.lng];
		//create an array to hold location coords, with state passed fomr tip.js
		const markers = [];
		//take trips array of object and create an array of coordinates.
		this.props.locations.forEach(obj => {
			let coord = [obj.lat, obj.long];
			markers.push(coord);
		});
		//if leaflet has loaded, pass marker array for bounds
		if (
			this.leafletMap &&
			this.leafletMap.leafletElement &&
			this.state.tripView &&
			this.state.lat === ''
		) {
			this.leafletMap.leafletElement.fitBounds(markers, { padding: [20, 20] });
		}

		return (
			<>
				{this.leafletMap && this.leafletMap.leafletElement && (
					<button onClick={this.getCenterCoords}>click for map obj</button>
				)}
				<Map
					center={position}
					doubleClickZoom={true}
					Zoom={this.state.zoom}
					maxZoom={16}
					className='map'
					ref={m => {
						this.leafletMap = m;
					}}
					onClick={this.getCoord}
					attributionControl={false}
				>
					{this.state.tripView && (
						<GeoSearch
							ref={m => {
								this.leafletGeo = m;
							}}
							storeGeocode={this.storeGeocode}
						/>
					)}{' '}
					{!this.state.tripView && (
						<Control position='topright'>
							<input id='searchTerm'></input>
							<button onClick={this.fetchFbData}>search!</button>
							<select
								id='stars'
								value={this.state.stars}
								onChange={this.handleFieldChange}
							>
								<option value='0'>AnyStar</option>
								<option value='1'>1+Star</option>
								<option value='2'>2+Star</option>
								<option value='3'>3+Star</option>
								<option value='4'>4+Star</option>
							</select>
							{/* <select id='cats'>
								<option value=''>All Types</option>
								<option value='[FOOD_BEVERAGE]'>Food n Bev</option>
								<option value='[ARTS_ENTERTAINMENT]'>Arts n Farts</option>
								<option value='[FITNESS_RECREATION],'>Fit Recs</option>
								<option value='[HOTEL_LODGING]'>Stay</option>
								<option value='[SHOPPING_RETAIL]'>Shop</option>
								<option value='[TRAVEL_TRANSPORTATION]'>Transpo</option>
							</select> */}
							<div className='slidecontainer'>
								<p>0 to 25 miles from your marker</p>
								<input
									onChange={this.handleChange}
									type='range'
									min='1'
									max='40000'
									value={this.state.searchRange}
									id='myRange'
								/>
								<p>current settings: {this.state.searchRange / 1600}</p>
							</div>
						</Control>
					)}
					<TileLayer
						// attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
						url={Atoken}
					/>
					{!this.state.tripView && (
						<>
							<MarkerClusterGroup
								showCoverageOnHover={true}
								iconCreateFunction={createClusterCustomIcon}
								maxClusterRadius={50}
								zoomToBounds={{ padding: [50, 50] }}
							>
								{this.state.searchResults.map(location => (
									<Marker
										className='location'
										key={location.id}
										position={[
											location.location.latitude,
											location.location.longitude
										]}
										anchor='bottom'
										onClick={e => this.markerFocus(e, location)}
										icon={this.configMyIcon(location.locationType)}
									>
										<Tooltip>
											{location.name}
											{location.overall_star_rating}
										</Tooltip>
									</Marker>
								))}
							</MarkerClusterGroup>
						</>
					)}
					{this.state.tripView && (
						<MarkerClusterGroup
							showCoverageOnHover={true}
							iconCreateFunction={createClusterCustomIcon}
							maxClusterRadius={50}
							zoomToBounds={{ padding: [50, 50] }}
						>
							{this.props.locations.map(location => (
								<Marker
									className='location'
									key={location.id}
									position={[location.lat, location.long]}
									anchor='bottom'
									onClick={e => this.markerFocus(e, location)}
									icon={this.configMyIcon(location.locationType)}
								>
									<Tooltip>{location.name}</Tooltip>
								</Marker>
							))}
						</MarkerClusterGroup>
					)}
					<Control position='bottomright'>
						<button onClick={this.mapToggle}>SWITCH MAP Stylie</button>
					</Control>
					<Control position='bottomright'>
						<button onClick={this.searchToggle}>SWITCH to EXPLORE</button>
					</Control>
				</Map>
			</>
		);
	}
}
