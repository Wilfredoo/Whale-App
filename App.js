import React, { Component } from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import Auth from "./components/Auth.js";
import Loading from "./components/Loading.js";
import Profile from "./components/Profile.js";
import History from "./components/History.js";
import Locatione from "./components/Locatione.js";
import Map from "./components/Map.js";

import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import firebase from "firebase";
import { firebaseConfig } from "./config.js";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
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
    Profile: {
      screen: Profile,
      navigationOptions: {
        title: "Profile",
        tabBarLabel: "Profile",
        tabBarIcon: ({ tintColor }) => (
          <MaterialCommunityIcons name="fish" size={20} color={tintColor} />
        ),
        tabBarOptions: {
          activeTintColor: "black",
          inactiveTintColor: "gray"
        }
      }
    },

    Main: {
      screen: Locatione,
      // screen: Map,

      navigationOptions: {
        tabBarLabel: "Main",
        tabBarIcon: ({ tintColor }) => (
          <MaterialCommunityIcons name="earth" size={20} color={tintColor} />
        ),
        tabBarOptions: {
          activeTintColor: "black",
          inactiveTintColor: "gray"
        }
      }
    },
    History: {
      screen: History,
      headerTitle: "aaa",
      navigationOptions: {
        tabBarLabel: "History",
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons name="history" size={20} color={tintColor} />
        ),
        tabBarOptions: {
          activeTintColor: "black",
          inactiveTintColor: "gray"
        }
      }
    }
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
  DashboardTabNavigator: DashboardTabNavigator
});

const AppSwitchNavigator = createSwitchNavigator({
  Loading: { screen: Loading },
  Auth: { screen: Auth },

  Dashboard: { screen: DashboardStackNavigator }
});

const AppContainer = createAppContainer(AppSwitchNavigator);
