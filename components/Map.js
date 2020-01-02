import React from "react";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import firebase from "firebase";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import { mapStyle } from "./mapStyle.js";
import Modal from "react-native-modals";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

import {
  Button,
  Text,
  Image,
  StyleSheet,
  View,
  Dimensions,
  Callout,
  TextInput,
  StatusBar,
  YellowBox,
  ActivityIndicator
} from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";

let user;

let last12hours = new Date().getTime() - 12 * 3600 * 1000;

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
      locations: null
    };
  }

  async componentDidMount() {
    this.currentUser = await firebase.auth().currentUser;
    await this.registerForPushNotificationsAsync();
    // console.log("map opening and her emy props", this.props);
    user = this.currentUser.displayName;
    await this.readLocations();
    // console.warn("anyway I can see this?", this.state);
    // console.warn("user u there in Map.js", this.currentUser);
  }

  setModalVisible(visible) {
    console.log("is this firing?");
    this.setState({ modalVisible: visible }, () => {
      console.log(this.state.modalVisible);
    });
  }

  readFriends = () => {
    allFriends = [];
    let myFriends = firebase
      .database()
      .ref("/users")
      .orderByChild("first_name");
    myFriends.on("value", snapshot => {
      // console.log("I should see an object with users here", snapshot);
      snapshot.forEach(thing => {
        // console.log("thing 1", thing.val().first_name);
        // console.log("thing 2", thing.val().last_name);
        oneFriend = [];
        oneFriend.push(
          thing.val().first_name,
          thing.val().last_name,
          thing.val().uid,
          thing.val().push_token
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
          // console.log("show me show me", this.state.friends);
        }
      );
      // console.log("all friends", allFriends);
    });
  };

  sendLocation = (targetUID, targetFirst, targetLast, userPushToken) => {
    console.warn("send location called", targetUID, targetFirst, targetLast);
    this.writeUnderSender(targetUID, targetFirst, targetLast);
    this.writeUnderReceiver(targetUID, targetFirst, targetLast, userPushToken);
  };

  writeUnderSender = (targetUID, targetFirst, targetLast) => {
    console.warn(
      "write under sender fired",
      targetUID,
      targetFirst,
      targetLast
    );
    firebase
      .database()
      .ref("/locations")
      .child(this.currentUser.uid)
      .push({
        sender: user,
        receiver: targetFirst + " " + targetLast,
        latitude: this.props.location.coords.latitude,
        longitude: this.props.location.coords.longitude,
        // latitude: 52,
        // longitude: 13,
        created_at: Date.now(),
        order: -Date.now(),
        type: "sender"
      });
    this.setState({ modalVisible: false });
  };

  writeUnderReceiver = (targetUID, targetFirst, targetLast, userPushToken) => {
    console.warn("write under receiver fired", targetFirst, targetLast);
    firebase
      .database()
      .ref("/locations")
      .child(targetUID)
      .push({
        sender: user,
        receiver: targetFirst + " " + targetLast,
        latitude: this.props.location.coords.latitude,
        longitude: this.props.location.coords.longitude,
        // latitude: 52,
        // longitude: 13,
        created_at: Date.now(),
        order: -Date.now(),
        type: "receiver",
        type_order: "receiver" + Date.now()
      });
    this.sendPushNotification(userPushToken);
    this.setState({ modalVisible: false });
  };

  readLocations = () => {
    allLocations = [];
    // try {
    let locations = firebase
      .database()
      .ref("/locations")
      .child(this.currentUser.uid)
      // .orderByChild("created_at")
      // .startAt(last12hours);
      .orderByChild("type_order")
      .startAt("receiver" + last12hours)
      .endAt("receiver" + Date.now());

    // } catch (err) {
    //   console.warn("this guy is a location virgin", err);
    //   console.warn("this is state locations in the catch", this.state);
    // }
    locations.on("value", snapshot => {
      // console.warn("snapshot read locations", snapshot);
      snapshot.forEach(thing => {
        // console.log("thing");
        oneLocation = [];
        oneLocation.push(
          // thing.val().uid,
          thing.val().latitude,
          thing.val().longitude,
          thing.val().sender, //it used to be user before
          thing.val().type
        );
        allLocations.push(oneLocation);
        console.warn("show me those locations", allLocations);
      });

      this.setState({ locations: allLocations }, () => {
        // console.warn(
        //   "show me show me locations in state",
        //   this.state.locations
        // );
      });
    });
  };

  // notification functions here

  registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== "granted") {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== "granted") {
      return;
    }

    try {
      // Get the token that uniquely identifies this device
      let token = await Notifications.getExpoPushTokenAsync();
      this.setState({ userPushToken: token }, () => {
        // console.warn("is the token here?", this.state.userPushToken);
      });
      // console.log("make ur dreams come true!", token);
      // console.warn("make ur dreams come true!", token);

      // POST the token to your backend server from where you can retrieve it to send push notifications.
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
    console.warn(this.state.friends, "all friends");
    const filteredFriends = this.state.inMemoryFriends.filter(friend => {
      console.warn("friend bfore lowercase", friend);
      let contactLowercase = (friend[0] + " " + friend[1]).toLowerCase();
      console.warn("contact lowercase", contactLowercase);

      let searchTermLowercase = value.toLowerCase();
      console.warn("search term lower case", searchTermLowercase);
      console.warn("const filteredfriends", filteredfriends);

      return contactLowercase.indexOf(searchTermLowercase) > -1;
    });
    this.setState({ friends: filteredFriends }, () => {
      console.warn("how friend change", this.state.friends);
      console.warn("how friend change 2", this.state.filteredFriends);
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          annotations={markers}
          customMapStyle={mapStyle}
          showsUserLocation
          initialRegion={{
            latitude: this.props.location.coords.latitude,
            longitude: this.props.location.coords.longitude,
            // latitude: 52.5,
            // longitude: 13.41,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          style={styles.mapStyle}
        >
          <MapView.UrlTile urlTemplate="https://maps.googleapis.com/maps/api/staticmap?key=YOUR_API_KEY&center=52.5281715285354,13.413875306884835&zoom=15&format=png&maptype=roadmap&style=element:geometry%7Ccolor:0x1d2c4d&style=element:labels.text.fill%7Ccolor:0x8ec3b9&style=element:labels.text.stroke%7Ccolor:0x1a3646&style=feature:administrative.country%7Celement:geometry.stroke%7Ccolor:0x4b6878&style=feature:administrative.land_parcel%7Cvisibility:off&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0x64779e&style=feature:administrative.neighborhood%7Cvisibility:off&style=feature:administrative.province%7Celement:geometry.stroke%7Ccolor:0x4b6878&style=feature:landscape.man_made%7Celement:geometry.stroke%7Ccolor:0x334e87&style=feature:landscape.natural%7Celement:geometry%7Ccolor:0x023e58&style=feature:poi%7Celement:geometry%7Ccolor:0x283d6a&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x6f9ba5&style=feature:poi%7Celement:labels.text.stroke%7Ccolor:0x1d2c4d&style=feature:poi.business%7Cvisibility:off&style=feature:poi.park%7Celement:geometry.fill%7Ccolor:0x023e58&style=feature:poi.park%7Celement:labels.text%7Cvisibility:off&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x3C7680&style=feature:road%7Celement:geometry%7Ccolor:0x304a7d&style=feature:road%7Celement:labels%7Cvisibility:off&style=feature:road%7Celement:labels.text.fill%7Ccolor:0x98a5be&style=feature:road%7Celement:labels.text.stroke%7Ccolor:0x1d2c4d&style=feature:road.arterial%7Celement:labels%7Cvisibility:off&style=feature:road.highway%7Celement:geometry%7Ccolor:0x2c6675&style=feature:road.highway%7Celement:geometry.stroke%7Ccolor:0x255763&style=feature:road.highway%7Celement:labels%7Cvisibility:off&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0xb0d5ce&style=feature:road.highway%7Celement:labels.text.stroke%7Ccolor:0x023e58&style=feature:road.local%7Cvisibility:off&style=feature:transit%7Celement:labels.text.fill%7Ccolor:0x98a5be&style=feature:transit%7Celement:labels.text.stroke%7Ccolor:0x1d2c4d&style=feature:transit.line%7Celement:geometry.fill%7Ccolor:0x283d6a&style=feature:transit.station%7Celement:geometry%7Ccolor:0x3a4762&style=feature:water%7Celement:geometry%7Ccolor:0x0e1626&style=feature:water%7Celement:labels.text%7Cvisibility:off&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x4e6d70&size=480x360" />
          {this.state.locations &&
            this.state.locations
              .filter(data => {
                // console.log("find the sender and filter it", data);
                return data[3] === "receiver";
              })
              .map(data => {
                // console.log("data in {this.state.locations part}", data);
                // console.warn("data in {this.state.locations part}", data);
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
        <MapView.Callout>
          <View style={styles.fakemodal}>
            <Text>
              Looks like no whale sent you a sonar recently. Maybe make some
              whale friends?
            </Text>
          </View>
        </MapView.Callout>

        <MapView.Callout>
          <View style={styles.calloutView}>
            <TouchableOpacity onPress={this.readFriends}>
              <MaterialCommunityIcons name="radar" size={100} color={"red"} />
            </TouchableOpacity>
          </View>
        </MapView.Callout>
        <Modal visible={this.state.modalVisible}>
          <View style={styles.modal}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ modalVisible: false }, () => {
                  // console.log(this.state.modalVisible);
                });
              }}
            >
              <AntDesign
                style={styles.back}
                name="back"
                size={50}
                color="pink"
              />
            </TouchableOpacity>
            <Text>Choose the target for your sonar</Text>
            <TextInput
              placeholder="Search"
              placeholderTextColor="#dddddd"
              style={{
                backgroundColor: "#2f363c",
                height: 50,
                fontSize: 36,
                padding: 10,
                color: "white",
                borderBottomWidth: 0.5,
                borderBottomColor: "#7d90a0"
              }}
              onChangeText={value => this.searchContacts(value)}
            />
            <View>
              {this.state.friends ? (
                this.state.friends
                  .filter(data => {
                    console.warn(this.state.friends);
                    // console.log("friends, data in filter", data);
                    // console.log("current user uid", this.currentUser.uid);
                    return data[2] !== this.currentUser.uid;
                    // now I gotta replace this data0 for the one that show the targetUser
                  })
                  .map(data => {
                    // console.log("which data is the uid?", data);
                    // console.warn("which data is the push token is it 3?", data);

                    return (
                      <View style={styles.friendDiv}>
                        <TouchableOpacity
                          onPress={() => {
                            this.sendLocation(
                              data[2],
                              data[0],
                              data[1],
                              data[3]
                            );
                          }}
                        >
                          <Text style={styles.friendText}>
                            {data[0]}
                            {data[1]}
                          </Text>
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
  calloutView: {
    marginBottom: "5%"
  },
  friendDiv: {
    marginTop: 15,
    marginBottom: 15
  },

  friendText: {
    fontSize: 20
  },
  image: {
    height: 100
  },
  back: {
    marginTop: 50
  },
  modal: {
    padding: 20,
    backgroundColor: "yellow",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  fakemodal: {
    // // padding: 20,
    // backgroundColor: "gray",
    // opacity: 0.7,
    backgroundColor: "rgba(0,0,0,0.3)",
    // width: "80%",
    // height: "55%"
    backgroundColor: "gray",
    padding: 22,
    justifyContent: "center",
    // alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  }
});
