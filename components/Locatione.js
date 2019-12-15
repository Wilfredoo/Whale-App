import React, { Component } from "react";
import {
  Platform,
  Text,
  View,
  Button,
  Linking,
  AppState,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Modal from "react-native-modal";
import * as IntentLauncher from "expo-intent-launcher";
import Map from "./Map.js";

export default class Locatione extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      errorMessage: null,
      isLocationModalVisible: false,
      appState: AppState.currentState
    };
  }

  componentDidMount() {
    // console.warn("are u even triggering?");
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      this._getLocationAsync();
    }
    this.setState({ appState: nextAppState });
  };

  componentWillMount() {
    // console.warn("and how about you u triggering?");

    AppState.addEventListener("change", this.handleAppStateChange);
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    } else {
      // console.warn("started from up now we here");
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    // console.warn("u even trying?");
    try {
      // console.warn("hopefuly we can get the location");
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      // console.warn("gimme that status", status);
      if (status !== "granted") {
        // console.warn("I'll just shut down I guess...");
        this.setState({
          errorMessage: "Permission to access location was denied"
        });
        return;
      }
      // console.warn("shit down below not running i think", location);
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation
        // enableHighAccuracy: true
      });
      // console.warn("here the location also", location);

      this.setState({ location }, () => {
        // console.warn("what up in state", this.state);
      });
      // console.warn("log this pls // locatione.js", this.state);
    } catch (error) {
      let status = Location.getProviderStatusAsync();

      if (!status.locationServicesEnabled) {
        this.setState({ isLocationModalVisible: true });
      }
    }
  };

  openSetting = () => {
    if (Platform.OS == "ios") {
      Linking.openURL("app-settings:");
    } else {
      IntentLauncher.startActivityAsync(
        IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
      );
    }
    this.setState({ openSetting: false });
  };

  render() {
    let text = "Waiting..";
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }
    if (this.state.location !== null) {
      return <Map location={this.state.location} />;
    } else {
      // console.warn("not getting location so gotta wait :(");
      return (
        <View style={styles.container}>
          <Text>Map is loading, wait a second</Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
