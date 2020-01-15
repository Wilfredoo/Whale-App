import React from "react";
import { View, Button } from "react-native";
import firebase from "firebase";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";

export default class NotificationsPush extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    await this.registerForPushNotificationsAsync();
  }

  registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return;
    }

    try {
      let token = await Notifications.getExpoPushTokenAsync();
      console.log("make ur dreams come true!", token);
      console.warn("make ur dreams come true!", token);
      firebase
        .database()
        .ref("users/" + this.currentUser.uid + "/push_token")
        .set(token);
    } catch (error) {
      console.log("oh no error help!", error);
    }
  };

  sendPushNotification = () => {
    let response = fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json"
      },

      body: JSON.stringify({
        to: "ExponentPushToken[RqLTPhIUb5gwoO8ri6l4mq]",
        sound: "default",
        title: "Sonar received",
        body: "A whale in the neighbourhood has sent you a notification"
      })
    });
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button
          title="Send push notification"
          onPress={this.sendPushNotification}
        />
      </View>
    );
  }
}
