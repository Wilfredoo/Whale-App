import React from "react";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import firebase from "firebase";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import { mapStyle } from "./mapStyle.js";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import calculateMaxMinDeltaValues from "../helpers/calculateMaxMinLatLong.js";

import {
  Button,
  Text,
  Image,
  StyleSheet,
  View,
  Modal,
  Dimensions,
  Callout,
  TextInput,
  StatusBar,
  YellowBox,
  ActivityIndicator
} from "react-native";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native";

let user;

let last12hours = new Date().getTime() - 120000 * 3600 * 1000;

let markers = [
  {
    latitude: 52.65,
    longitude: 13.9,
    title: "Foo Place",
    subtitle: "1234 Foo Drive"
  }
];

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      locations: ["a"],
      fakeModalVisible: false
    };
    this.state.deltaValues = {
      // latsDiff: -10,
      // longDiff: 70,
      // deltaLat: 20,
      // deltaLong: 100
    };
  }

  async componentDidMount() {
    this.currentUser = await firebase.auth().currentUser;
    user = this.currentUser.displayName;
    await this.readLocations();
    await this.registerForPushNotificationsAsync();
    if (
      !this.state.locations ||
      (this.state.locations && this.state.locations.length === 0)
    ) {
      this.setState({ fakeModalVisible: true }, () => {
        console.warn("state of fakemodalvisible", this.state.fakeModalVisible);
      });
    }
  }

  setModalVisible(visible) {
    console.log("is this firing?");
    this.setState({ modalVisible: visible }, () => {
      console.log(this.state.modalVisible);
    });
  }

  readUsers = () => {
    console.warn("wattup");
    allFriends = [];
    let myFriends = firebase
      .database()
      .ref("/users")
      .child("NXkSDudzoOSfW15oL72LlmxfDTC3")
      .orderByChild("first_name");
    myFriends.on("value", snapshot => {
      console.log("I should see an object with users here", snapshot);
      console.warn("I should see an object with users here", snapshot);

      snapshot.forEach(thing => {
        // console.log("thing 1", thing.val().first_name);
        // console.log("thing 2", thing.val().last_name);
        // console.log("can I also acces the user displayname here?", user);

        oneFriend = [];
        oneFriend.push(
          thing.val().first_name,
          thing.val().last_name,
          thing.val().uid,
          thing.val().push_token,
          user
        );
        // console.log("one friend", oneFriend);
        allFriends.push(oneFriend);
      });
      this.setState(
        {
          friends: allFriends,
          inMemoryFriends: allFriends,
          modalVisible: true
        },
        () => {
          console.log("show me show me the users", this.state.friends);
        }
      );
      // console.log("all friends", allFriends);
    });
  };

  //retrieve all senders and receiver from the user

  sendLocation = (
    targetUID,
    targetFirst,
    targetLast,
    userPushToken,
    targetUsername
  ) => {
    this.writeUnderSender(targetUID, targetFirst, targetLast, targetUsername);
    this.writeUnderReceiver(
      targetUID,
      targetFirst,
      targetLast,
      userPushToken,
      targetUsername
    );
  };

  writeUnderSender = (targetUID, targetFirst, targetLast, targetUsername) => {
    firebase
      .database()
      .ref("/locations")
      .child(this.currentUser.uid)
      .push({
        sender: user,
        receiver: targetUsername,
        latitude: this.props.location.coords.latitude,
        longitude: this.props.location.coords.longitude,
        created_at: Date.now(),
        order: -Date.now(),
        type: "sender"
      });
    this.setState({ modalVisible: false });
  };

  writeUnderReceiver = (
    targetUID,
    targetFirst,
    targetLast,
    userPushToken,
    targetUsername
  ) => {
    console.warn("write under receiver fired", targetFirst, targetLast);
    firebase
      .database()
      .ref("/locations")
      .child(targetUID)
      .push({
        sender: user,
        receiver: targetUsername,
        latitude: this.props.location.coords.latitude,
        longitude: this.props.location.coords.longitude,
        created_at: Date.now(),
        order: -Date.now(),
        type: "receiver",
        type_order: "receiver" + Date.now()
      });
    this.sendPushNotification(userPushToken);
    this.setState({ modalVisible: false });
  };

  readLocations = () => {
    // console.warn(
    //   "whats my location?",
    //   this.props.location.coords.latitude,
    //   this.props.location.coords.longitude
    // );

    allLocations = [];
    allLocationsAndMine = [];

    myLocation = [];
    myLocation.push(
      this.props.location.coords.latitude,
      this.props.location.coords.longitude
    );
    // console.warn("myLocation 1", myLocation);
    let locations = firebase
      .database()
      .ref("/locations")
      .child(this.currentUser.uid)
      .orderByChild("type_order")
      .startAt("receiver" + last12hours)
      .endAt("receiver" + Date.now());
    locations.on("value", snapshot => {
      snapshot.forEach(thing => {
        oneLocation = [];
        oneLocation.push(
          thing.val().latitude,
          thing.val().longitude,
          thing.val().sender,
          thing.val().type
        );
        allLocations.push(oneLocation);
        allLocationsAndMine.push(oneLocation);
        // console.log("all locations here", allLocations);
      });
      allLocationsAndMine.push(myLocation);
      // console.warn("all lcs and mine", allLocationsAndMine);

      const deltaValues = calculateMaxMinDeltaValues(allLocationsAndMine);
      this.setState(
        { locations: allLocations, deltaValues: deltaValues },
        () => {
          // console.warn(
          //   "show me deltas diffs",
          //   this.state.deltaValues.latsDiff,
          //   this.state.deltaValues.longDiff,
          //   this.state.deltaValues.deltaLat,
          //   this.state.deltaValues.deltaLong
          // );
        }
      );
    });
  };

  registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return;
    }

    try {
      let token = await Notifications.getExpoPushTokenAsync();
      this.setState({ userPushToken: token }, () => {
        console.warn(".", this.state.userPushToken);
      });
      firebase
        .database()
        .ref("users/" + this.currentUser.uid + "/push_token")
        .set(token);
    } catch (error) {
      console.log("oh no error help!", error);
    }
  };
  sendPushNotification = userPushToken => {
    let response = fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        to: userPushToken,
        sound: "default",
        title: "Cool notification",
        body:
          "Someone sent you a notification while your phone was in your pocket"
      })
    });
  };

  searchContacts = value => {
    const filteredUsers = this.state.inMemoryUsers.filter(user => {
      console.warn("user before lowercase", user);
      let contactLowercase = (user[0] + " " + user[1]).toLowerCase();
      let searchTermLowercase = value.toLowerCase();
      return contactLowercase.indexOf(searchTermLowercase) > -1;
    });
    this.setState({ users: filteredUsers }, () => {
      console.warn(".");
    });
  };

  render() {
    // {
    //   this.state.deltaValues &&
    //     console.warn("log this bitte", typeof this.state.deltaValues.longDiff);
    //   console.warn("log this bitte 2", typeof this.state.deltaValues.latsDiff);
    //   console.warn("type 1", this.state.deltaValues.longDiff);
    //   console.warn("type 2", this.state.deltaValues.latsDiff);
    // }
    return (
      <View style={styles.container}>
        {this.state.deltaValues &&
          this.state.deltaValues.longDiff &&
          this.state.deltaValues.latsDiff &&
          this.state.deltaValues.deltaLat &&
          this.state.deltaValues.deltaLong && (
            <MapView
              annotations={markers}
              customMapStyle={mapStyle}
              showsUserLocation
              initialRegion={{
                latitude: this.state.deltaValues.latsDiff,
                longitude: this.state.deltaValues.longDiff,
                latitudeDelta: this.state.deltaValues.deltaLat,
                longitudeDelta: this.state.deltaValues.deltaLong
              }}
              style={styles.mapStyle}
            >
              <MapView.UrlTile urlTemplate="https://maps.googleapis.com/maps/api/staticmap?key=YOUR_API_KEY&center=52.5281715285354,13.413875306884835&zoom=15&format=png&maptype=roadmap&style=element:geometry%7Ccolor:0x1d2c4d&style=element:labels.text.fill%7Ccolor:0x8ec3b9&style=element:labels.text.stroke%7Ccolor:0x1a3646&style=feature:administrative.country%7Celement:geometry.stroke%7Ccolor:0x4b6878&style=feature:administrative.land_parcel%7Cvisibility:off&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0x64779e&style=feature:administrative.neighborhood%7Cvisibility:off&style=feature:administrative.province%7Celement:geometry.stroke%7Ccolor:0x4b6878&style=feature:landscape.man_made%7Celement:geometry.stroke%7Ccolor:0x334e87&style=feature:landscape.natural%7Celement:geometry%7Ccolor:0x023e58&style=feature:poi%7Celement:geometry%7Ccolor:0x283d6a&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x6f9ba5&style=feature:poi%7Celement:labels.text.stroke%7Ccolor:0x1d2c4d&style=feature:poi.business%7Cvisibility:off&style=feature:poi.park%7Celement:geometry.fill%7Ccolor:0x023e58&style=feature:poi.park%7Celement:labels.text%7Cvisibility:off&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x3C7680&style=feature:road%7Celement:geometry%7Ccolor:0x304a7d&style=feature:road%7Celement:labels%7Cvisibility:off&style=feature:road%7Celement:labels.text.fill%7Ccolor:0x98a5be&style=feature:road%7Celement:labels.text.stroke%7Ccolor:0x1d2c4d&style=feature:road.arterial%7Celement:labels%7Cvisibility:off&style=feature:road.highway%7Celement:geometry%7Ccolor:0x2c6675&style=feature:road.highway%7Celement:geometry.stroke%7Ccolor:0x255763&style=feature:road.highway%7Celement:labels%7Cvisibility:off&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0xb0d5ce&style=feature:road.highway%7Celement:labels.text.stroke%7Ccolor:0x023e58&style=feature:road.local%7Cvisibility:off&style=feature:transit%7Celement:labels.text.fill%7Ccolor:0x98a5be&style=feature:transit%7Celement:labels.text.stroke%7Ccolor:0x1d2c4d&style=feature:transit.line%7Celement:geometry.fill%7Ccolor:0x283d6a&style=feature:transit.station%7Celement:geometry%7Ccolor:0x3a4762&style=feature:water%7Celement:geometry%7Ccolor:0x0e1626&style=feature:water%7Celement:labels.text%7Cvisibility:off&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x4e6d70&size=480x360" />
              {this.state.locations &&
                this.state.locations
                  .filter(data => {
                    return data[3] === "receiver";
                  })
                  .map(data => {
                    return (
                      <Marker
                        coordinate={{
                          latitude: data[0],
                          longitude: data[1]
                        }}
                        title={data[2]}
                      >
                        <Image
                          source={require("../assets/icon.png")}
                          style={{ width: 40, height: 40 }}
                          resizeMode="contain"
                        />
                      </Marker>
                    );
                  })}
              <StatusBar
                barStyle="dark-content"
                hidden={false}
                backgroundColor="#00BCD4"
                translucent={false}
                networkActivityIndicatorVisible={true}
              />
            </MapView>
          )}

        {this.state.fakeModalVisible && (
          <MapView.Callout>
            <View style={styles.fakeModalContainer}>
              <View style={styles.fakeModalView}>
                <Text style={styles.fakeModalText}>
                  Looks like no whale sent you a sonar recently. Maybe make some
                  whale friends?
                </Text>
                <TouchableOpacity
                  onPress={() => this.setState({ fakeModalVisible: false })}
                >
                  <Text>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </MapView.Callout>
        )}

        <MapView.Callout>
          <View style={styles.sonarContainer}>
            <View style={styles.sonarView}>
              <TouchableOpacity onPress={this.readUsers}>
                <MaterialCommunityIcons name="radar" size={100} color={"red"} />
              </TouchableOpacity>
            </View>
          </View>
        </MapView.Callout>
        <Modal visible={this.state.modalVisible}>
          <View style={styles.modal}>
            <View style={styles.modalFlex}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ modalVisible: false }, () => {});
                }}
              >
                <AntDesign
                  style={styles.back}
                  name="leftcircle"
                  size={50}
                  color="pink"
                  Ant
                />
              </TouchableOpacity>
              <TextInput
                placeholder="Search..."
                placeholderTextColor="black"
                style={styles.modalSearch}
                onChangeText={value => this.searchContacts(value)}
              />
            </View>
            <Text style={styles.friendsText}>Choose a target</Text>
            <View>
              {this.state.users ? (
                this.state.users
                  .filter(data => {
                    console.warn(this.state.users);
                    return data[2] !== this.currentUser.uid;
                  })
                  .map(data => {
                    console.warn("i want to see that hh here?", data);
                    return (
                      <View style={styles.friendUnit}>
                        <TouchableOpacity
                          onPress={() => {
                            this.sendLocation(
                              data[2],
                              data[0],
                              data[1],
                              data[3],
                              data[4]
                            );
                          }}
                        >
                          <Text style={styles.friendName}>{data[4]}</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })
              ) : (
                <ActivityIndicator size="large" color="#0000ff" />
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  sonarContainer: {},
  sonarView: {
    marginBottom: "5%"
  },
  friendUnit: {
    marginTop: 15,
    marginBottom: 15
  },

  friendName: {
    fontSize: 18,
    fontWeight: "bold"
  },
  image: {
    height: 100
  },
  back: {},

  modalFlex: {
    flexDirection: "row",
    alignItems: "center"
  },
  modal: {
    padding: 20,
    backgroundColor: "white",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  fakeModalContainer: {
    flex: 1,
    alignItems: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "center"
  },

  fakeModalView: {
    width: "80%",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 42,
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  fakeModalText: {
    fontSize: 16,
    textAlign: "justify",
    lineHeight: 30,
    color: "black"
  },
  friendText: {
    fontSize: 14,
    marginBottom: 20
  },
  modalSearch: {
    height: 50,
    fontSize: 26,
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#7d90a0"
  }
});
