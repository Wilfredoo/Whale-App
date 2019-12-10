import React, { Component } from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import Auth from "./components/Auth.js";
import Loading from "./components/Loading.js";
import Profile from "./components/Profile.js";
import History from "./components/History.js";
import Map from "./components/Map.js";
import Locatione from "./components/Locatione.js";
import Contactos from "./components/Contacts.js";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import firebase from "firebase";
import { firebaseConfig } from "./config.js";
import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createSwitchNavigator } from "react-navigation";

firebase.initializeApp(firebaseConfig);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

class App extends Component {
  render() {
    return <AppContainer />;
  }
}
export default App;

const DashboardTabNavigator = createBottomTabNavigator(
  {
    Profile,
    Locatione,
    History
  },
  {
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      return {
        headerTitle: routeName
      };
    }
  }
);
const DashboardStackNavigator = createStackNavigator({
  Auth: Auth,
  DashboardTabNavigator: DashboardTabNavigator
});

const AppSwitchNavigator = createSwitchNavigator({
  Loading: { screen: Loading },
  Dashboard: { screen: DashboardStackNavigator }
});

const AppContainer = createAppContainer(AppSwitchNavigator);
