import React from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import * as Google from "expo-google-app-auth";
import firebase from "firebase";

export default class Auth extends React.Component {
  onSignIn = googleUser => {
    // console.warn("this gets called", googleUser);
    console.log("this gets called", googleUser);

    var unsubscribe = firebase.auth().onAuthStateChanged(
      function(firebaseUser) {
        unsubscribe();
        if (!this.isUserEqual(googleUser, firebaseUser)) {
          // console.log("his this what is happening?")
          // Build Firebase credential with the Google ID token.
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken

            // googleUser.getAuthResponse().user.id
          );
          firebase
            .auth()
            .signInWithCredential(credential)
            .then(function(result) {
              if (result.additionalUserInfo.isNewUser) {
                firebase
                  .database()
                  .ref("/users/" + result.user.uid)
                  .set({
                    gmail: result.user.email,
                    profile_picture: result.additionalUserInfo.profile.picture,
                    locale: result.additionalUserInfo.profile.locale,
                    first_name: result.additionalUserInfo.profile.given_name,
                    last_name: result.additionalUserInfo.profile.family_name,
                    created_at: Date.now()
                  })
                  .then(() => {
                    console.log("got here?");
                  });
              } else {
                console.log("how about here");
                firebase
                  .database()
                  .ref("/users/" + result.user.uid)
                  .update({
                    last_logged_in: Date.now()
                  });
              }
            })
            .catch(function(error) {
              console.log("oh no, errors are happening", error);
              var errorCode = error.code;
              var errorMessage = error.message;
              var email = error.email;
              var credential = error.credential;
            });
        } else {
          console.log("User already signed-in Firebase.");
        }
      }.bind(this)
    );
  };

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          return true;
        }
      }
    }
    return false;
  };

  signInWithGoogleAsync = async () => {
    console.log("sign in before all");
    try {
      console.log("try me");
      const result = await Google.logInAsync({
        androidClientId:
          "353993328565-stdu06g46sji65o8i2ovu5npcga8aj8k.apps.googleusercontent.com",
        iosClientId:
          "353993328565-cfouoqpnlrkdiefvlig301vglbl523kf.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      });
      console.log("omg", result);
      console.warn("omg", result);

      if (result.type === "success") {
        console.log("success auth", result);
        this.onSignIn(result);
        this.props.navigation.navigate("Map");
        return result.accessToken;
      } else {
        console.log("canceled auth");

        return { cancelled: true };
      }
    } catch (e) {
      console.log("error auth", e);
      console.warn("error auth", e);

      return { error: true };
    }
  };
  render() {
    console.log("trying to render auth");
    return (
      <View style={styles.container}>
        <Text>Whale App</Text>
        <Image
          style={{ width: 150, height: 150 }}
          source={{
            uri: "./assets/splash.png"
          }}
        />
        <Button
          onPress={() => this.signInWithGoogleAsync()}
          title="Sign Up"
        ></Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
