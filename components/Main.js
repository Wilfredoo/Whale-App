import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  FlatList,
  ActivityIndicator
} from "react-native";
import { parsePhoneNumberFromString } from "libphonenumber-js";


export default class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      contacts: []
    };
  }



  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text>Hi</Text>
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

// Main page
// you can see all sonars from last 12 hours* they appear as little dots, lighting intertimmently
// you can see a list of all the sonars being shown on your map* where?
// you can zoom by: country, city, world, closest 5 whales*hard? is this the best? posible?
// if you touch one of the dots, you can see who is that person and when they sonared you* it appears down, you can close it or expand it
// you can go to history* in the navigation tab
// you can go to profile* nav tab
// you can send a sonar* in the corner of map?
// once you send a sonar, you can see a wave expanding around you
