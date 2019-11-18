import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Auth from "./components/Auth.js";
import Loading from "./components/Loading.js";
import Main from "./components/Main.js";
import Map from "./components/Map.js";

import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import firebase from 'firebase'
import { firebaseConfig } from "./config.js";


firebase.initializeApp(firebaseConfig)

const AppNavigator = createStackNavigator(
    {
        Auth: Auth,
        Loading: Loading,
        Main:Main,
        Map:Map
    },
    {
        initialRouteName: "Main"
    }
);

const AppContainer = createAppContainer(AppNavigator);

export default function App() {
    return <AppContainer />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    }
});




