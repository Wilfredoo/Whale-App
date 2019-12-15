import React from "react";
import {
  Text,
  View,
  Button,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet
} from "react-native";
import firebase from "firebase";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditInput: false,
      newName: ""
    };
  }

  async componentDidMount() {
    this.currentUser = await firebase.auth().currentUser;
    await this.registerForPushNotificationsAsync();
    // console.warn("user u there in profile", this.currentUser);
    user = this.currentUser.displayName;
    this.setState(
      {
        user: user
      },
      () => {
        // console.log("user display name?", this.state.user);
      }
    );
  }

  handleChangeText = text => {
    console.log("consoling text, ", text);
    this.setState(
      {
        newName: text
      },
      () => {
        console.log(this.state.newName);
      }
    );
  };

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
      // console.log("make ur dreams come true!", token);
      // console.warn("make ur dreams come true!", token);
      // POST the token to your backend server from where you can retrieve it to send push notifications.
      firebase
        .database()
        .ref("users/" + this.currentUser.uid + "/push_token")
        .set(token);
    } catch (error) {
      console.log("oh no error help!", error);
    }
  };

  editName = () => {
    this.setState({ showEditInput: true });
  };

  saveName = () => {
    let that = this;
    let user = firebase.auth().currentUser;
    user
      .updateProfile({
        displayName: this.state.newName
      })
      .then(function() {
        that.setState({ showEditInput: false, user: user.displayName });
        console.log("great is worked", user);
      })
      .catch(function(error) {
        console.log("oh no error ;;(", error);
      });
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
        title: "Demo",
        body: "Demo notification"
      })
    });
  };

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {this.state.user ? (
            <View>
              <Text style={styles.welcome}>Hey there {this.state.user}</Text>
              <Button
                style={styles.button}
                title="Sign Out"
                onPress={() => {
                  firebase.auth().signOut();
                }}
              />
              <Button
                style={styles.button}
                title="Edit Name"
                onPress={this.editName}
              />

              {this.state.showEditInput === true && (
                <View>
                  <TextInput
                    defaultValue={this.state.newName}
                    style={{
                      height: 40,
                      width: 200,
                      borderColor: "gray",
                      borderWidth: 1,
                      marginTop: 20,
                      marginBottom: 20
                    }}
                    onChangeText={this.handleChangeText}
                    placeholder="New name or username"
                  />
                  <Button
                    style={{ marginTop: 20 }}
                    title="Save"
                    onPress={this.saveName}
                  />
                </View>
              )}
            </View>
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 20
  }
});
