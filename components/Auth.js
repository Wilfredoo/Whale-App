import React from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase'


export default class Auth extends React.Component {
  

  onSignIn = googleUser => {
    console.log(googleUser)


    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // console.warn("his this what is happening?")
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken

          // googleUser.getAuthResponse().user.id

            );
        // Sign in with credential from the Google user.
        firebase.auth().signInWithCredential(credential).then(function(result) {
          if(result.additionalUserInfo.isNewUser) {

          
          firebase.database().ref('/users/' + result.user.uid).set({
            gmail: result.user.email,
            profile_picture: result.additionalUserInfo.profile.picture,
            locale: result.additionalUserInfo.profile.locale,
            first_name: result.additionalUserInfo.profile.given_name,
            last_name: result.additionalUserInfo.profile.family_name,
            created_at: Date.now()
          }).then( () => {
// console.warn("got here?")
          })
        } else {
          console.warn("how about here")
          firebase.database().ref('/users/' + result.user.uid).update({
            last_logged_in: Date.now()
          })
        }
        }).catch(function(error) {
          // console.log("oh no, errors are happening", error)
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
      } else {
        // console.warn('User already signed-in Firebase.');
      }
    }.bind(this));
  }

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.getBasicProfile().getId()) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }

    signInWithGoogleAsync = async () => {
      console.warn("sign in before all")
        try {
          const result = await Google.logInAsync({
            androidClientId: '353993328565-stdu06g46sji65o8i2ovu5npcga8aj8k.apps.googleusercontent.com',
            iosClientId: "353993328565-cfouoqpnlrkdiefvlig301vglbl523kf.apps.googleusercontent.com",
            scopes: ['profile', 'email'],
          });
          console.warn("omg", result)

          if (result.type === 'success') {
            console.warn("success auth", result)
this.onSignIn(result)
this.props.navigation.navigate('Main')
            return result.accessToken;

          } else {
            // console.warn("canceled auth")

            return { cancelled: true };
          }
        } catch (e) {
          console.warn("error auth", e)

          return { error: true };
        }
      }
    render() {
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
                    title="Sign Up"></Button>
                
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
