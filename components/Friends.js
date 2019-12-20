import React from "react";
import { Text, View, StyleSheet } from "react-native";
import firebase from "firebase";

export default class Friends extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  readFriends = () => {
    let allFriends = firebase.database.ref("/users").orderByChild("first_name");
    allFriends.on("value", snapshot => {
      console.log("I should see an object with users here", snapshot);
      snapshot.forEach(thing => {
        console.log("thing", thing.val());
        oneFriend = [];
        oneFriend.push(thing.val().first_name, thing.val().last_name);
        allFriends.push(oneFriend);
      });
    });
    this.setState({ friends: allFriends }, () => {
      console.log("show me show me", this.state.friends);
    });
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Your friends</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
