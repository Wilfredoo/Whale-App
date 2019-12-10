import React from "react";
import { Text, View, Button } from "react-native";
import firebase from "firebase";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    this.currentUser = await firebase.auth().currentUser;
    await this.registerForPushNotificationsAsync();
    console.warn("user u there in profile", this.currentUser);
    user = this.currentUser.displayName;
    this.setState(
      {
        user: user
      },
      () => {
        console.log("user display name?", this.state.user);
      }
    );
  }

  registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== "granted") {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== "granted") {
      return;
    }

    try {
      // Get the token that uniquely identifies this device
      let token = await Notifications.getExpoPushTokenAsync();
      console.log("make ur dreams come true!", token);
      console.warn("make ur dreams come true!", token);

      // POST the token to your backend server from where you can retrieve it to send push notifications.
      firebase
        .database()
        .ref("users/" + this.currentUser.uid + "/push_token")
        .set(token);
    } catch (error) {
      console.log("oh no error help!", error);
    }
  };

  // signOut() {
  //   console.warn("sign her out");
  //   console.log("sign her out");

  //   firebase.auth().signOut();
  //   this.props.navigate("Auth");
  // }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Hey there {this.state.user}</Text>
        <Button
          title="Sign Out"
          onPress={() => {
            firebase.auth().signOut();
          }}
        />
      </View>
    );
  }
}
