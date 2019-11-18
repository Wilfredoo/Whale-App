import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import firebase from 'firebase';

class Loading extends Component {
  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    console.warn("checking if logged in")
    firebase.auth().onAuthStateChanged(
      user => {
        console.warn('AUTH STATE CHANGED CALLED ')
        if (user) {
          this.props.navigation.navigate('Main');
        } else {
          this.props.navigation.navigate('Auth');
        }
      }
    );
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
    alignItems: 'center',
    justifyContent: 'center'
  }
});