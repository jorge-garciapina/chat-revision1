const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  // 'email' field will store the user's password. This field is unique and required.
  email: { type: String, required: true, unique: true },

  // 'username' field will store the user's username. This field is unique and required.
  username: { type: String, required: true, unique: true },

  // 'contactList' field will store the list of contacts of the user. Defaults to an empty array.
  contactList: { type: Array, default: [] },

  // 'receivedContactRequests' field will store the contact requests received by the user.
  receivedContactRequests: [
    {
      sender: { type: String, required: true },
      date: { type: Date, default: Date.now },
      status: { type: String, default: "pending" },
    },
  ],

  // 'rejectedContactRequests' field will store the contact requests rejected by the user.
  rejectedContactRequests: [
    {
      receiver: { type: String, required: true },
      date: { type: Date, default: Date.now },
      rejectionCount: { type: Number, default: 0 }, // track number of rejections
    },
  ],

  // 'spendingContactRequests' field will store the contact requests sent by the user and are pending.
  pendingContactRequests: [
    {
      receiver: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],

  // 'avatar' field will store the user's avatar. Defaults to 'defaultAvatar.png'.
  avatar: { type: String, default: "defaultAvatar.png" },
});

module.exports = mongoose.model("User", UserSchema);
