// sendLocation = targetUser => {
//   console.warn("send location called", targetUser);
//   console.log("send location called", targetUser);

//   this.sendLocationFriend(targetUser);
//   this.writeReceivedLocation(targetUser);
// };

// sendLocationFriend = targetUser => {
//   console.log("sendlocationfriend target user?", targetUser);
//   firebase
//     .database()
//     .ref("/locations")
//     .child(this.currentUser.uid)
//     .child("Sent")
//     .child(Date.now())
//     .set({
//       uid: this.currentUser.uid,
//       user: user,
//       targetUser: targetUser,
//       latitude: 25,
//       longitude: 25,
//       type: "sent",
//       // latitude: this.props.location.coords.latitude,
//       // longitude: this.props.location.coords.longitude,
//       created_at: Date.now(),
//       order: -Date.now()
//     });
//   this.sendPushNotification();
// };

// sendLocation = targetUser => {
//   console.log("sendlocationfriend target user?", targetUser);
//   console.warn("sendlocationfriend target user?", targetUser);
//   firebase
//     .database()
//     .ref("/locations")
//     .child(Date.now())
//     .set({
//       sender: this.currentUser.uid,
//       receiver: targetUser,
//       user: user,
//       latitude: 25,
//       longitude: 25,
//       sender_receiver: this.currentUser.uid + "to" + targetUser,
//       // latitude: this.props.location.coords.latitude,
//       // longitude: this.props.location.coords.longitude,
//       created_at: Date.now(),
//       order: -Date.now()
//     });
//   this.sendPushNotification();
//   this.setState({ modalVisible: false });
// };

// latitude: this.props.location.coords.latitude,
// longitude: this.props.location.coords.longitude,

// writeReceivedLocation = targetUser => {
//   console.log("target user in received location", targetUser);
//   firebase
//     .database()
//     .ref("/locations")
//     .child(targetUser)
//     .child("Received")
//     .child(Date.now())
//     .set({
//       uid: this.currentUser.uid,
//       user: user,
//       targetUser: targetUser,
//       latitude: 25,
//       longitude: 25,
//       type: "received",

//       // latitude: this.props.location.coords.latitude,
//       // longitude: this.props.location.coords.longitude,
//       created_at: Date.now(),
//       order: -Date.now()
//     });
// };
