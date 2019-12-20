import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import firebase from "firebase";

class Loading extends Component {
  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    // console.warn("checking if logged in function called");
    firebase.auth().onAuthStateChanged(user => {
      // console.warn("AUTH STATE CHANGED CALLED ", user);
      if (user) {
        // console.warn("there is indeed a user");
        this.props.navigation.navigate("Main");
      } else {
        // console.warn("go authenticate");
        this.props.navigation.navigate("Auth");
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Please wait there</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}
export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
