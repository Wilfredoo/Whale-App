import React from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import * as Google from "expo-google-app-auth";
import firebase from "firebase";
import { AntDesign } from "@expo/vector-icons";
// import { TouchableOpacity } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class Auth extends React.Component {
  onSignIn = googleUser => {
    console.warn("this gets called", googleUser);
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
                    console.warn("got here?");
                  });
              } else {
                // console.log("how about here");
                firebase
                  .database()
                  .ref("/users/" + result.user.uid)
                  .update({
                    last_logged_in: Date.now()
                  });
              }
            })
            .catch(function(error) {
              console.warn("oh no, errors are happening", error);
              var errorCode = error.code;
              var errorMessage = error.message;
              var email = error.email;
              var credential = error.credential;
            });
        } else {
          // console.log("User already signed-in Firebase.");
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
    console.warn("sign in before all");
    try {
      console.warn("try me");
      const result = await Google.logInAsync({
        androidClientId:
          "353993328565-stdu06g46sji65o8i2ovu5npcga8aj8k.apps.googleusercontent.com",
        iosClientId:
          "353993328565-cfouoqpnlrkdiefvlig301vglbl523kf.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      });
      console.warn("omg", result);

      if (result.type === "success") {
        console.warn("success auth", result);
        this.onSignIn(result);
        this.props.navigation.navigate("Main");
        return result.accessToken;
      } else {
        console.log("canceled auth");

        return { cancelled: true };
      }
    } catch (e) {
      console.warn("error auth", e);

      return { error: true };
    }
  };
  render() {
    // console.log("trying to render auth");
    return (
      <View style={styles.container}>
        <Text>Whale App</Text>
        <Image
          source={require("../assets/icon.png")}
          style={styles.whaleIcon}
          resizeMode="contain"
        />
        <TouchableOpacity onPress={() => this.signInWithGoogleAsync()}>
          <View style={styles.googleButton}>
            <AntDesign
              style={styles.googleIcon}
              name="googleplus"
              size={35}
              color="white"
            />
            <Text style={styles.googleText}>Looog In with Google</Text>
          </View>
        </TouchableOpacity>
        {/* <Button
          onPress={() => this.signInWithGoogleAsync()}
          title="Sign Up"
        ></Button> */}
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
  },
  googleButton: {
    backgroundColor: "#dd4b39",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 50
  },
  googleIcon: {
    marginRight: 15
  },
  googleText: {
    fontSize: 20,
    color: "white",
    fontFamily: "Roboto"
  },
  whaleIcon: {
    width: 40,
    height: 40,
    margin: 20
  }
});
