import React from "react";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { mapStyle } from "./mapStyle.js";
import Modal, { ModalContent } from "react-native-modals";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Button,
  Dimensions,
  Image
} from "react-native";
import firebase from "firebase";
import { ScrollView } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import moment from "moment";
import { AntDesign } from "@expo/vector-icons";

let markers = [
  {
    latitude: 52.65,
    longitude: 13.9,
    title: "Foo Place",
    subtitle: "1234 Foo Drive"
  }
];

export default class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    };
  }

  async componentDidMount() {
    this.currentUser = await firebase.auth().currentUser;
    await this.readHistory();
  }

  showHistoryUnit = (data1, data2) => {
    console.warn("hi whale", data1, data2);
    // console.warn("this  still happens");
    this.props.navigation("map2");
    return <Map2 latitude={data1} longitude={data1} />;
  };

  // setModalVisible = visible => {
  //   console.log("setModalvisible pls");
  //   this.setState({ modalVisible: visible }, () => {
  //     console.log("console log is your friend", this.state.modalVisible);
  //   });
  // };

  setModalVisible(visible) {
    console.log("is this firing?");
    this.setState({ modalVisible: visible }, () => {
      console.log(this.state.modalVisible);
    });
  }

  readHistory = () => {
    console.log("read sents fired");
    console.warn("read sents fired");
    allHistory = [];
    let myHistory = firebase
      .database()
      .ref("/locations")
      .orderByChild("sender_receiver")
      .equalTo(this.currentUser.uid);
    // .equalTo("GG99AaPQjMhr0kT1xFkazjHMUrm1");

    // .orderByChild("order")
    // .limitToLast(25);
    myHistory.on("value", snapshot => {
      console.log("am i getting firebase info at all?", snapshot);
      console.warn("am i getting firebase info at all?", snapshot);

      snapshot.forEach(thing => {
        console.log("thing", thing.val());
        oneHistory = [];
        oneHistory.push(
          thing.val().sender,
          thing.val().receiver,
          thing.val().latitude,
          thing.val().longitude,
          thing.val().user,
          thing.val().created_at
        );
        allHistory.push(oneHistory);
      });
      this.setState({ history: allHistory }, () => {
        console.log("state pls", this.state.history);
        console.warn("state pls", this.state.history);
      });
      console.log("gimme all history", allHistory);
      console.warn("gimme all history", allHistory);
    });
  };

  // readHistory = () => {
  //   console.log("read history fired");
  //   this.readSentHistory;
  //   this.readReceivedHistory;
  // };

  // readSentHistory = () => {
  //   console.log("read sents fired");

  //   allHistory = [];
  //   let myHistory = firebase
  //     .database()
  //     .ref("/locations")
  //     .child(this.currentUser.uid)
  //     .child("Sent")
  //     .orderByChild("order")
  //     .limitToLast(25);
  //   myHistory.on("value", snapshot => {
  //     // console.log("am i getting firebase info at all?", snapshot);
  //     snapshot.forEach(thing => {
  //       // console.log("thing", thing.val());
  //       oneHistory = [];
  //       oneHistory.push(
  //         thing.val().uid,
  //         thing.val().latitude,
  //         thing.val().longitude,
  //         thing.val().user,
  //         thing.val().created_at,
  //         thing.val().targetUser
  //       );
  //       allHistory.push(oneHistory);
  //     });
  //     this.setState({ history: allHistory }, () => {
  //       console.log("state pls", this.state.history[0][1]);
  //     });
  //     // console.log("gimme all history", allHistory);
  //   });
  // };

  // readReceivedHistory = () => {
  //   console.log("read receiveds fired");
  //   allHistory = [];
  //   let myHistory = firebase
  //     .database()
  //     .ref("/locations")
  //     .child(this.currentUser.uid)
  //     .child("Received")
  //     .orderByChild("order")
  //     .limitToLast(25);
  //   myHistory.on("value", snapshot => {
  //     // console.log("am i getting firebase info at all?", snapshot);
  //     snapshot.forEach(thing => {
  //       // console.log("thing", thing.val());
  //       oneHistory = [];
  //       oneHistory.push(
  //         thing.val().uid,
  //         thing.val().latitude,
  //         thing.val().longitude,
  //         thing.val().user,
  //         thing.val().created_at,
  //         thing.val().targetUser
  //       );
  //       allHistory.push(oneHistory);
  //     });
  //     this.setState({ history: allHistory }, () => {
  //       console.log("state pls", this.state.history[0][1]);
  //     });
  //     // console.log("gimme all history", allHistory);
  //   });
  // };

  render() {
    return (
      <View style={styles.container}>
        <Text>History of the last sonars you have received</Text>
        <ScrollView>
          {this.state.history ? (
            this.state.history.map(data => {
              return (
                <View style={styles.historyUnit}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState(
                        {
                          modalVisible: true,
                          latitude: data[1],
                          longitude: data[2]
                        },
                        () => {
                          console.log(
                            "here should be the coords I want",
                            this.state.latitude,
                            this.state.longitude
                          );
                        }
                      );
                    }}
                  >
                    <Text style={styles.unitText}>From {data[0]}</Text>
                    <Text style={styles.unitText}>to {data[1]}</Text>

                    <Text style={styles.unitText}>
                      {" "}
                      {moment(data[5]).fromNow()}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </ScrollView>
        <Modal visible={this.state.modalVisible}>
          <MapView
            annotations={markers}
            customMapStyle={mapStyle}
            showsUserLocation
            initialRegion={{
              // latitude: this.state.latitude,
              // longitude: this.state.longitude,
              latitude: 50,
              longitude: 13,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
            style={styles.mapStyle}
          >
            <MapView.UrlTile urlTemplate="https://maps.googleapis.com/maps/api/staticmap?key=YOUR_API_KEY&center=52.5281715285354,13.413875306884835&zoom=15&format=png&maptype=roadmap&style=element:geometry%7Ccolor:0x1d2c4d&style=element:labels.text.fill%7Ccolor:0x8ec3b9&style=element:labels.text.stroke%7Ccolor:0x1a3646&style=feature:administrative.country%7Celement:geometry.stroke%7Ccolor:0x4b6878&style=feature:administrative.land_parcel%7Cvisibility:off&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0x64779e&style=feature:administrative.neighborhood%7Cvisibility:off&style=feature:administrative.province%7Celement:geometry.stroke%7Ccolor:0x4b6878&style=feature:landscape.man_made%7Celement:geometry.stroke%7Ccolor:0x334e87&style=feature:landscape.natural%7Celement:geometry%7Ccolor:0x023e58&style=feature:poi%7Celement:geometry%7Ccolor:0x283d6a&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x6f9ba5&style=feature:poi%7Celement:labels.text.stroke%7Ccolor:0x1d2c4d&style=feature:poi.business%7Cvisibility:off&style=feature:poi.park%7Celement:geometry.fill%7Ccolor:0x023e58&style=feature:poi.park%7Celement:labels.text%7Cvisibility:off&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x3C7680&style=feature:road%7Celement:geometry%7Ccolor:0x304a7d&style=feature:road%7Celement:labels%7Cvisibility:off&style=feature:road%7Celement:labels.text.fill%7Ccolor:0x98a5be&style=feature:road%7Celement:labels.text.stroke%7Ccolor:0x1d2c4d&style=feature:road.arterial%7Celement:labels%7Cvisibility:off&style=feature:road.highway%7Celement:geometry%7Ccolor:0x2c6675&style=feature:road.highway%7Celement:geometry.stroke%7Ccolor:0x255763&style=feature:road.highway%7Celement:labels%7Cvisibility:off&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0xb0d5ce&style=feature:road.highway%7Celement:labels.text.stroke%7Ccolor:0x023e58&style=feature:road.local%7Cvisibility:off&style=feature:transit%7Celement:labels.text.fill%7Ccolor:0x98a5be&style=feature:transit%7Celement:labels.text.stroke%7Ccolor:0x1d2c4d&style=feature:transit.line%7Celement:geometry.fill%7Ccolor:0x283d6a&style=feature:transit.station%7Celement:geometry%7Ccolor:0x3a4762&style=feature:water%7Celement:geometry%7Ccolor:0x0e1626&style=feature:water%7Celement:labels.text%7Cvisibility:off&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x4e6d70&size=480x360" />

            <Marker
              coordinate={{
                // latitude: this.state.latitude,
                // longitude: this.state.longitude
                latitude: 50,
                longitude: 13
              }}
              title="This should be me"
              description="Some description"
            >
              <Image
                source={require("../assets/icon.png")}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            </Marker>
          </MapView>
          <MapView.Callout>
            <TouchableOpacity
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}
            >
              <AntDesign
                style={styles.back}
                name="back"
                size={50}
                color="pink"
              />
            </TouchableOpacity>
          </MapView.Callout>
        </Modal>
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
  },
  back: {
    marginTop: 50
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  }
});
