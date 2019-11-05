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
		searchRange: 8000,
		stars: '3',
		recievedTrip: false,
		mapLoaded: false
	};

	//function for storing click events on geosearch and click to add markers
	storeGeocode = (e, obj) => {
		//console.log('yaya got dem O-B-Js', obj);
		this.props.addGeoSearchMarker(obj);
	};

	//function to storing click events on main map, using scroll to function

	markerFocus = (e, obj) => {
		//console.log('got the deets', obj);
		if (this.state.mapLoaded === false) {
			this.setState({ mapLoaded: true });
			console.log('set state maploaded');
		}
		this.props.scrollTo(obj.id);
	};

	resetScroll = () => {
		this.setState({ mapLoaded: false });
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
				//console.log(this.state.searchResults);
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
		//console.log('trip deets from trip at didmount', this.props.tripDetails);

		const map = this.leafletMap.leafletElement;
		const geocoder = L.Control.Geocoder.mapbox(Token);
		let marker;

		map.on('click', e => {
			this.props.dropPin();
			geocoder.reverse(
				e.latlng,
				map.options.crs.scale(map.getZoom()),
				results => {
					var r = results[0];
					//	console.log('reverse geocode results', r);

					if (r) {
						this.setState({
							lat: r.center.lat,
							lng: r.center.lng
						});
						if (marker) {
							map.removeLayer(marker);
							marker = L.marker(r.center, { icon: myIcon4 })
								.bindTooltip(r.name, { className: 'toolTip' })
								.addTo(map)
								.on('click', e => this.storeGeocode(e, r));
							// .openPopup();
						} else {
							marker = L.marker(r.center, { icon: myIcon4 })
								.bindTooltip(r.name.split(',')[0], { className: 'toolTip' })
								.addTo(map)
								.on('click', e => this.storeGeocode(e, r));
							// .openPopup();
						}
					}
				}
			);
		});

		//trying to set state in order to pass geosearch props but it breaks everything
		//this.setState({ recievedTrip: true });
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
		//console.log(lat, lng);
	};

	saveObj = obj => {
		console.log('fb obj', obj);
	};

	componentDidUpdate(prevProps) {
		// Typical usage (don't forget to compare props):
		if (this.props.tripDetails !== prevProps.tripDetails) {
			const tripCoords = [
				this.props.tripDetails.lat,
				this.props.tripDetails.lng
			];

			this.setState({ recievedTrip: true });

			if (this.props.locations.length === 0) {
				this.leafletMap.leafletElement.setView(tripCoords, 13);
				//option to drop a marker on the map at trip coords until user has added content
				// 	L.marker(tripCoords, { icon: myIcon4 })
				// 		.bindTooltip(this.props.tripDetails.name, { className: 'toolTip' })
				// 		.addTo(this.leafletMap.leafletElement);
			}
		}
	}

	//pass filter function through a local function in order to reset mapLoading state

	//mapbox://styles/jerodis/ck24x2b5a12ro1cnzdopvyw08 light
	//mapbox://styles/jerodis/ck24wv71g15vb1cp90thseofp dark
	render() {
		//console.log('trip deets from trip at render', this.props.tripDetails);
		let Atoken;
		if (this.state.light === true) {
			Atoken = `https://api.mapbox.com/styles/v1/jerodis/ck24x2b5a12ro1cnzdopvyw08/tiles/256/{z}/{x}/{y}@2x?access_token=${Token.MB}`;
		} else {
			Atoken = `https://api.mapbox.com/styles/v1/jerodis/ck24wv71g15vb1cp90thseofp/tiles/256/{z}/{x}/{y}@2x?access_token=${Token.MB}`;
		}

		const position = [this.state.lat, this.state.lng];
		//create an array to hold location coords, with state passed fomr tip.js
		const markers = [];
		//create array to hold tripDetails coords
		const tripCoords = [this.props.tripDetails.lat, this.props.tripDetails.lng];
		//take trips array of object and create an array of coordinates.
		this.props.locations.forEach(obj => {
			let coord = [obj.lat, obj.lng];
			markers.push(coord);
		});

		//if leaflet has loaded, pass marker array for bounds
		if (
			this.leafletMap &&
			this.leafletMap.leafletElement &&
			this.state.tripView &&
			this.props.clickedCoords.length === 0 &&
			this.props.droppedPin === false &&
			markers.length > 0 &&
			this.state.mapLoaded === false
		) {
			console.log('fit bounds render');
			this.leafletMap.leafletElement.fitBounds(markers, { padding: [20, 20] });
		} else if (
			this.leafletMap &&
			this.leafletMap.leafletElement &&
			this.state.tripView &&
			this.props.droppedPin === false &&
			this.props.clickedCoords.length > 0
		) {
			//console.log('cicked coords', this.props.clickedCoords);
			//console.log('marker coords', markers);
			//if not first load, and link has been clicked, zoom to marker
			console.log('clicked place from list render');

			this.leafletMap.leafletElement.setView(this.props.clickedCoords, 13);
		} else if (
			this.leafletMap &&
			this.leafletMap.leafletElement &&
			this.state.tripView &&
			markers.length === 0 &&
			this.props.tripDetails.length > 0 &&
			this.state.mapLoaded === false
		) {
			console.log('no locations', tripCoords);
			this.leafletMap.leafletElement.setView(tripCoords, 13);
		}

		return (
			<>
				{/* {this.leafletMap && this.leafletMap.leafletElement && (
					<button onClick={this.getCenterCoords}>click for map obj</button>
				)} */}
				<Map
					center={position}
					doubleClickZoom={true}
					Zoom={this.state.zoom}
					maxZoom={16}
					className='mapComponent'
					ref={m => {
						this.leafletMap = m;
					}}
					onClick={this.getCoord}
					attributionControl={false}
				>
					{this.state.tripView && this.state.recievedTrip && (
						<GeoSearch
							ref={m => {
								this.leafletGeo = m;
							}}
							storeGeocode={this.storeGeocode}
							tripDetails={this.props.tripDetails}
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
										className={'scroll' + location.id}
										key={location.id}
										position={[
											location.location.latitude,
											location.location.longitude
										]}
										anchor='bottom'
										onClick={e => this.saveObj(location)}
										// icon={this.configMyIcon(location.locationTypeId)}
									>
										<Tooltip>
											{location.name} {location.overall_star_rating}
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
									position={[location.lat, location.lng]}
									onMouseMove={e => this.markerFocus(e, location)}
									// onMouseOut={e => this.props.hoverRemoveFocus()}
									icon={this.configMyIcon(location.locationTypeId)}
									onClick={e => this.props.toggleDrawer2(location)}
								>
									<Tooltip>{location.name}</Tooltip>
									{/* <Popup
										coordinates={[location.lat, location.lng]}
										anchor='bottom'
										offset={[0, -35]}
									>
										{location.name}
									</Popup> */}
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
