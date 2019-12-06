import React from "react";
import { Text, View } from "react-native";
import firebase from "firebase";

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    this.currentUser = await firebase.auth().currentUser;
    // console.warn("user u there in profile", this.currentUser);
    user = this.currentUser.displayName;

    this.setState(
      {
        user: user
      },
      () => {
        console.log("user in state?", this.state);
      }
    );
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Here should be your profile info!</Text>
      </View>
    );
  }
}
