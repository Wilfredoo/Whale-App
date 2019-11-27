import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Auth from "./components/Auth.js";
import Loading from "./components/Loading.js";
import Profile from "./components/Profile.js";
import History from "./components/History.js";
import Main from "./components/Main.js";
import Map from "./components/Map.js";
import Locatione from "./components/Locatione.js";
import Contactos from "./components/Contacts.js";
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons'
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import firebase from 'firebase'
import { firebaseConfig } from "./config.js";
import { Ionicons } from '@expo/vector-icons';



firebase.initializeApp(firebaseConfig)

const AppNavigator = createStackNavigator(
    {
        Auth: Auth,
        Loading: Loading,
        Main:Main,
        Locatione:Locatione,
        Map: Map,
        Contactos: Contactos
    },
    {
        initialRouteName: "Locatione"
    }
);

const AppContainer = createAppContainer(AppNavigator);

export default function App() {
    return <AppContainer />;
}



// const TabNavigator = createBottomTabNavigator({
//     Profile: {screen: Profile},
//     Main: {screen: Map},
//     History: {screen: History}
//   }, 
//   {
//       initialRouteName: "Main"
//   });



  
//   export default createAppContainer(TabNavigator);



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    }
});




