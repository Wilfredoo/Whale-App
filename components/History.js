import React from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import firebase from "firebase";
import { ScrollView } from "react-native-gesture-handler";

export default class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    this.currentUser = await firebase.auth().currentUser;
    this.readHistory();
  }

  readHistory = () => {
    allHistory = [];
    let myHistory = firebase
      .database()
      .ref("/locations")
      .child(this.currentUser.uid);
    myHistory.on("value", snapshot => {
      // console.log("am i getting firebase info at all?", snapshot);
      snapshot.forEach(thing => {
        // console.log("thing", thing.val());
        // console.log("thing", thing.val().uid);
        oneHistory = [];
        oneHistory.push(
          thing.val().uid,
          thing.val().latitude,
          thing.val().longitude,
          thing.val().user,
          thing.val().created_at
        );
        allHistory.push(oneHistory);
      });
      this.setState({ history: allHistory }, () => {
        console.log("state pls", this.state.history[0][1]);
      });
      // console.log("gimme all history", allHistory);
      // console.log("whats this?", this);
    });
  };

  // add a limit to 10

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>History of your last sonars</Text>
        {/* <Text>{this.state.history && this.state.history[0][1]}</Text>
        <Text>{this.state.history && this.state.history[0][2]}</Text>
        <Text>{this.state.history && this.state.history[0][3]}</Text>
        <Text>{this.state.history && this.state.history[0][4]}</Text> */}
        {/* <FlatList
          data={this.state.history && this.state.history[0][1]}
          data={this.state.history && this.state.history[0][2]}
          data={this.state.history && this.state.history[0][3]}
          data={this.state.history && this.state.history[0][4]}
          renderItem={({ item }) => <Text>{item.key}</Text>}
        /> */}

        <ScrollView>
          {this.state.history &&
            this.state.history.map(data => {
              console.log("give it to me history", data);
              return (
                <View>
                  <Text>{data[1]}</Text>
                  <Text>{data[2]}</Text>
                  <Text>{data[3]}</Text>
                  <Text>{data[4]}</Text>
                </View>
              );
            })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44
  }
});
