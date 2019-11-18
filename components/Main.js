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

import * as Contacts from "expo-contacts";

import * as Permissions from "expo-permissions";

const uniqueItems = items => [...new Set(items)];

const filterData = contacts => {
  // Go through each contact
  // Collect their phone numbers
  // Normalize the phone numbers
  // Filter duplicates
  // return the contacts with unique numbers
  return contacts.map(contact => {
    if (!contact.phoneNumbers) {
      return contact;
    }
    let phoneNumbers = contact.phoneNumbers
      .map(phoneNumber => {
        return { phoneNumber, parsedPhoneNumber: parsePhoneNumberFromString(phoneNumber.number, "DE") }
      })
      .filter(({phoneNumber, parsedPhoneNumber}) => {
        if (!parsedPhoneNumber) {
          return false;
        }
        return true;
      })
      .map(({parsedPhoneNumber}) => {
        return parsedPhoneNumber.number;
      });

    return { ...contact, phoneNumbers:uniqueItems(phoneNumbers) };
  });
};

export default class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      contacts: []
    };
  }

  loadContacts = async () => {
    const permission = await Permissions.askAsync(Permissions.CONTACTS);

    if (permission.status !== "granted") {
      return;
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers]
    });

    console.log(data);
    this.setState({
      contacts: filterData(data),
      inMemoryContacts: data,
      isLoading: false
    });
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    this.loadContacts();
  }

  renderItem = ({ item }) => (
    <View style={{ minHeight: 70, padding: 5 }}>
      <Text style={{ color: "#bada55", fontSize: 16 }}>
        {item.firstName + " "}
        {item.lastName}
      </Text>
      <Text style={{ color: "white", fontWeight: "bold" }}>
        {JSON.stringify(item.phoneNumbers)}
      </Text>
    </View>
  );

  searchContacts = value => {
    const filteredContacts = this.state.inMemoryContacts.filter(contact => {
      let contactLowercase = (
        contact.firstName +
        " " +
        contact.lastName
      ).toLowerCase();

      let searchTermLowercase = value.toLowerCase();

      return contactLowercase.indexOf(searchTermLowercase) > -1;
    });
    this.setState({ contacts: filteredContacts });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ backgroundColor: "#2f363c" }} />
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
        <View style={{ flex: 1, backgroundColor: "#2f363c" }}>
          {this.state.isLoading ? (
            <View
              style={{
                ...StyleSheet.absoluteFill,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <ActivityIndicator size="large" color="#bad555" />
            </View>
          ) : null}
          <FlatList
            data={this.state.contacts}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 50
                }}
              >
                <Text style={{ color: "#bad555" }}>No Contacts Found</Text>
              </View>
            )}
          />
        </View>
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
