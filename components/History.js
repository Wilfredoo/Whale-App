import React from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import firebase from "firebase";
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";

export default class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    console.log("i think this is working", moment(1575921697390).fromNow());

    this.currentUser = await firebase.auth().currentUser;
    this.readHistory();
  }

  showHistoryUnit() {
    console.log("hi whale");
  }

  readHistory = () => {
    allHistory = [];
    let myHistory = firebase
      .database()
      .ref("/locations")
      .child(this.currentUser.uid)
      .orderByChild(created_at)
      .limitToLast(25);
    myHistory.on("value", snapshot => {
      // console.log("am i getting firebase info at all?", snapshot);
      snapshot.forEach(thing => {
        // console.log("thing", thing.val());
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
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>History of your last sonars</Text>
        <ScrollView>
          {this.state.history ? (
            this.state.history.map(data => {
              // console.log("give it to me history", data);
              return (
                <View style={styles.historyUnit} onPress={this.showHistoryUnit}>
                  {/* <Text style={styles.unitText}>{data[1]}</Text>
                  <Text style={styles.unitText}>{data[2]}</Text> */}
                  <Text style={styles.unitText}>{data[3]}</Text>
                  <Text style={styles.unitText}>
                    {" "}
                    {moment(data[4]).fromNow()}
                  </Text>
                </View>
              );
            })
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    marginLeft: 30
  },
  historyUnit: {
    marginTop: 15,
    marginBottom: 15
  },
  unitText: {
    fontSize: 20
  }
});
