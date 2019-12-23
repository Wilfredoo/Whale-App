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

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {/* <Header
  leftComponent={{ icon: 'menu', color: '#fff' }}
  centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
  rightComponent={{ icon: 'home', color: '#fff' }}
/> */}
          {this.state.user ? (
            <View>
              <Text style={styles.welcome}>Hey there {this.state.user}</Text>
              <Button
                style={{ marginBottom: 20 }}
                title="Sign Out"
                onPress={() => {
                  firebase.auth().signOut();
                }}
              />
              <Text style={styles.dots}>...</Text>
              {/* <Button
                style={{ marginBottom: 20 }}
                title="Edit Name"
                onPress={this.editName}
              /> */}

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
                    placeholder="New Username"
                  />
                  <Button
                    style={{ marginTop: 20 }}
                    title="Change username"
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
  },

  welcome: {
    marginBottom: 20
  },
  dots: {
    color: "white"
  }
});
