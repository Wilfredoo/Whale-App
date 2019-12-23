import React, { Component } from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import Auth from "./components/Auth.js";
import Loading from "./components/Loading.js";
import Profile from "./components/Profile.js";
import History from "./components/History.js";

import Locatione from "./components/Locatione.js";
import Contactos from "./components/Contacts.js";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import firebase from "firebase";
import { firebaseConfig } from "./config.js";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons
} from "@expo/vector-icons";
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
        )
      }
    },

    Main: {
      screen: Locatione,
      navigationOptions: {
        tabBarLabel: "Main",
        tabBarIcon: ({ tintColor }) => (
          <MaterialCommunityIcons name="earth" size={20} color={tintColor} />
        )
      }
    },
    History: {
      screen: History,
      navigationOptions: {
        tabBarLabel: "History",
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons name="history" size={20} color={tintColor} />
        )
      }
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        // if (routeName === "Home") {
        //   iconName = `ios-information-circle${focused ? "" : "-outline"}`;
        //   // Sometimes we want to add badges to some icons.
        //   // You can check the implementation below.
        //   IconComponent = HomeIconWithBadge;
        // } else if (routeName === "Settings") {
        //   iconName = `ios-options`;
        // }

        // You can return any component that you like here!
        return <IconComponent name={iconName} size={25} color={tintColor} />;
      }
    }),

    tabBarOptions: {
      activeTintColor: "tomato",
      inactiveTintColor: "gray"
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
