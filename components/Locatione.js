
import React, { Component } from 'react';
import { Platform, Text, View, Button, Linking,AppState } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Modal from 'react-native-modal'
import * as IntentLauncher from 'expo-intent-launcher';
import Map from "./Map.js";


export default class Locatione extends Component {
  state = {
    location: null,
    errorMessage: null,
    isLocationModalVisible: false,
    appState: AppState.currentState

  };

  componentDidMount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      this._getLocationAsync();
    }
    this.setState({ appState: nextAppState });
  };


  componentWillMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    try {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
      return
    }

    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation});
    this.setState({ location });
    console.log("log this pls", this.state)
  } catch (error) {
    let status = Location.getProviderStatusAsync();

    if (!status.locationServicesEnabled) {
      this.setState({isLocationModalVisible:true})
      }

    
  };
}

  openSetting = () => {
if (Platform.OS =='ios') {
  Linking.openURL('app-settings:')
} else {
  IntentLauncher.startActivityAsync(
    IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
  )
}
this.setState({openSetting:false})
  }

  render() {
    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }

    return (
<Map locatione={this.state}/>
    );
  }
}

