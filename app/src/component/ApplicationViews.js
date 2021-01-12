import { Route, Redirect, withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import Trip from './TripView/TripView';
import MobileTrip from './TripView/MobileTripView';
import TripList from './WorldView/WoldView';
import MobileTripList from './WorldView/MobileWorldView';
import { isMobile } from 'react-device-detect';

class ApplicationViews extends Component {
    state = {
        loaded: false,
        tripData: {}
        //OwnerView: false
    };

    render() {
        //console.log('app view render props', this.props);
        // console.log(isMobile);
        return (
            <React.Fragment>
                <Route
                    exact
                    path='/'
                    render={props => {
                        if (this.props.isAuthenticated) {
                            return <Redirect to='/mytrips' />;
                        } else {
                            return <Redirect to='/login' />;
                        }
                    }}
                />

                <Route
                    exact
                    path='/mytrips'
                    render={props => {
                        if (this.props.isAuthenticated && isMobile) {
                            return (
                                <MobileTripList
                                    {...props}
                                    activeUser={this.props.user.id}
                                    clearUser={this.props.clearUser}
                                    email={this.props.user.email}
                                    // setOwner={this.setOwner}
                                    // removeOwner={this.removeOwner}
                                />
                            );
                        } else if (this.props.isAuthenticated) {
                            return (
                                <TripList
                                    {...props}
                                    activeUser={this.props.user.id}
                                    clearUser={this.props.clearUser}
                                    email={this.props.user.email}
                                    // setOwner={this.setOwner}
                                    // removeOwner={this.removeOwner}
                                />
                            );
                        } else {
                            return <Redirect to='/login' />;
                        }
                    }}
                />

                <Route
                    exact
                    path='/mytrips/:tripId'
                    render={props => {
                        if (this.props.isAuthenticated && isMobile) {
                            return (
                                <MobileTrip
                                    tripId={parseInt(props.match.params.tripId)}
                                    activeUser={this.props.user.id}
                                    email={this.props.user.email}
                                    //ownerView={this.state.ownerView}
                                    {...props}
                                />
                            );
                        } else if (this.props.isAuthenticated) {
                            return (
                                <Trip
                                    tripId={props.match.params.tripId}
                                    activeUser={this.props.user.id}
                                    email={this.props.user.email}
                                    //ownerView={this.state.ownerView}
                                    {...props}
                                />
                            );
                        } else {
                            return <Redirect to='/login' />;
                        }
                    }}
                />
            </React.Fragment>
        );
    }
}

export default withRouter(ApplicationViews);
