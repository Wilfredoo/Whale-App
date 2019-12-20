import React from "react";
import { Text, View, StyleSheet } from "react-native";
import firebase from "firebase";

export default class Boilerplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Your friends</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
