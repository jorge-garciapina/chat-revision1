const express = require("express");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./privateValues.env" });
const router = express.Router();
console.log("------------------------------------");
console.log("---------------START:---------------");
// Pre-defined users
const usersUser = [
  {
    email: "USER@example.com",
    username: "USER",
    password: "password123",
  },
  {
    email: "USER@example.com",
    username: "USER",
    password: "password123",
  },
];

// Endpoint to fetch users
router.get("/usersUser", (req, res) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  console.log(token);
  res.json(usersUser);
});

///////////////////////////////////
// Route to create a new user
router.post("/create", async (req, res) => {
  const { email, username, avatar, contactList } = req.body;
  try {
    const user = new User({ email, username, avatar, contactList });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

//////////////////////////////////
// Route to get a user's information using JWT
router.get("/info", async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    let decoded;
    try {
      // Decode the token to get the user id
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(200).json({ error: "Invalid or expired token" });
    }

    const username = decoded.username;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(200).json({ error: "User not found" });
    }

    const { email, contactList, avatar, friendRequests } = user;

    res
      .status(200)
      .json({ email, username, contactList, avatar, friendRequests });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});
///////////////////////////////////

// Route to search for a user
router.post("/searchUser", async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    let decoded;
    try {
      // Decode the token to get the current user
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(200).json({ error: "Invalid or expired token" });
    }

    const currentUsername = decoded.username;
    const currentUser = await User.findOne({ username: currentUsername });

    if (!currentUser) {
      return res.status(200).json({ error: "Current user not found" });
    }

    // Extract search term from the request body
    const searchTerm = req.body.searchTerm;

    // Search for the user by username or email
    const user = await User.findOne({
      $or: [{ username: searchTerm }, { email: searchTerm }],
    });

    if (!user) {
      return res
        .status(200)
        .json({ error: "No user found for the given search term" });
    }

    // Extract information about user
    const { username, avatar } = user;

    res.status(200).json({ username, avatar });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});
///////////////////////////////////

router.post("/sendContactRequest", async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    let decoded;
    try {
      // Decode the token to get the user id
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(200).json({ error: "Invalid or expired token" });
    }

    const senderUsername = decoded.username;
    const sender = await User.findOne({ username: senderUsername });

    if (!sender) {
      return res.status(200).json({ error: "Sender not found" });
    }

    const receiverUsername = req.body.receiverUsername;

    // Prevent users from sending a friend request to themselves
    if (senderUsername === receiverUsername) {
      return res
        .status(200)
        .json({ message: "You can't send a friend request to yourself." });
    }

    const receiver = await User.findOne({ username: receiverUsername });

    if (!receiver) {
      return res.status(200).json({ message: "Receiver not found" });
    }

    // Check if receiver is already in sender's contactList
    if (sender.contactList.includes(receiverUsername)) {
      return res
        .status(200)
        .json({ message: "You are already friends with this user." });
    }

    // Check if a pending request already exists
    const pendingRequest = sender.pendingContactRequests.find(
      (request) => request.receiver === receiverUsername
    );

    if (pendingRequest) {
      return res
        .status(200)
        .json({ message: "Pending request already exists" });
    }

    // Check if there are 3 or more rejected requests
    const rejectedRequest = sender.rejectedContactRequests.find(
      (request) => request.receiver === receiverUsername
    );

    if (rejectedRequest && rejectedRequest.rejectionCount >= 3) {
      return res.status(200).json({
        message: "Your request cannot be sent due to multiple past rejections",
      });
    }

    sender.pendingContactRequests.push({ receiver: receiverUsername });
    await sender.save();

    receiver.receivedContactRequests.push({
      sender: senderUsername,
      status: "pending",
    });
    await receiver.save();

    res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});
///////////////////////////////////

// Endpoint to retrieve contact requests
router.get("/retrieveContactRequests", async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    let decoded;
    try {
      // Decode the token to get the user id
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(200).json({ error: "Invalid or expired token" });
    }

    const username = decoded.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(200).json({ error: "User not found" });
    }

    // Extract and return just the sender usernames from the received contact requests
    const contactRequests = user.receivedContactRequests.map(
      (request) => request.sender
    );

    res.status(200).json(contactRequests);
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});
///////////////////////////////////

// Route to retrieve pending contact requests
router.get("/retrievePendingContactRequests", async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    let decoded;
    try {
      // Decode the token to get the user id
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(200).json({ error: "Invalid or expired token" });
    }

    const username = decoded.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(200).json({ error: "User not found" });
    }

    // Extract and return only the receiver names from pending contact requests
    const pendingContactRequests = user.pendingContactRequests.map(
      (request) => request.receiver
    );
    res.status(200).json(pendingContactRequests);
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});
///////////////////////////////////

// To accept a contact request
router.post("/acceptContactRequest", async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    let decoded;
    try {
      // Decode the token to get the user id
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(200).json({ error: "Invalid or expired token" });
    }

    const receiverUsername = decoded.username;
    const receiver = await User.findOne({ username: receiverUsername });

    if (!receiver) {
      return res.status(200).json({ error: "User not found" });
    }

    const senderUsername = req.body.senderUsername;
    const sender = await User.findOne({ username: senderUsername });

    // Ensure that a request from the sender exists in the receiver's receivedContactRequests
    const requestIndex = receiver.receivedContactRequests.findIndex(
      (request) =>
        request.sender === senderUsername && request.status === "pending"
    );

    if (requestIndex === -1) {
      return res
        .status(200)
        .json({ message: "No pending request from the specified sender" });
    }

    // Add each other to their contact lists
    receiver.contactList.push(senderUsername);
    sender.contactList.push(receiverUsername);

    // Remove the request from the receiver's receivedContactRequests and sender's pendingContactRequests
    receiver.receivedContactRequests.splice(requestIndex, 1);

    const pendingRequestIndex = sender.pendingContactRequests.findIndex(
      (request) => request.receiver === receiverUsername
    );
    sender.pendingContactRequests.splice(pendingRequestIndex, 1);

    await receiver.save();
    await sender.save();

    res.status(200).json({ message: "Contact request accepted" });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});
///////////////////////////////////

// To reject a contact request
router.post("/rejectContactRequest", async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    let decoded;
    try {
      // Decode the token to get the user id
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(200).json({ error: "Invalid or expired token" });
    }

    const receiverUsername = decoded.username;
    const receiver = await User.findOne({ username: receiverUsername });

    if (!receiver) {
      return res.status(200).json({ error: "User not found" });
    }

    const senderUsername = req.body.senderUsername;
    const sender = await User.findOne({ username: senderUsername });

    // Ensure that a request from the sender exists in the receiver's receivedContactRequests
    const requestIndex = receiver.receivedContactRequests.findIndex(
      (request) =>
        request.sender === senderUsername && request.status === "pending"
    );

    if (requestIndex === -1) {
      return res
        .status(200)
        .json({ message: "No pending request from the specified sender" });
    }

    // Remove the request from the receiver's receivedContactRequests and sender's pendingContactRequests
    receiver.receivedContactRequests.splice(requestIndex, 1);

    const pendingRequestIndex = sender.pendingContactRequests.findIndex(
      (request) => request.receiver === receiverUsername
    );
    sender.pendingContactRequests.splice(pendingRequestIndex, 1);

    // Add or update the rejection in the sender's rejectedContactRequests
    let rejection = sender.rejectedContactRequests.find(
      (rejection) => rejection.receiver === receiverUsername
    );

    if (rejection) {
      rejection.rejectionCount += 1;
      rejection.date = Date.now();
    } else {
      sender.rejectedContactRequests.push({
        receiver: receiverUsername,
        date: Date.now(),
        rejectionCount: 1,
      });
    }

    await receiver.save();
    await sender.save();

    res.status(200).json({ message: "Contact request rejected" });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});
///////////////////////////////////

router.post("/deleteContact", async (req, res) => {
  console.log(req.body);
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    let decoded;
    try {
      // Decode the token to get the user id
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(200).json({ error: "Invalid or expired token" });
    }

    const senderUsername = decoded.username;

    const sender = await User.findOne({ username: senderUsername });

    if (!sender) {
      return res.status(200).json({ error: "Sender not found" });
    }

    const receiverUsername = req.body.receiverUsername;
    const receiver = await User.findOne({ username: receiverUsername });

    if (!receiver) {
      return res.status(200).json({ error: "Receiver not found" });
    }

    // Check if receiver is in sender's contactList
    const contactIndex = sender.contactList.findIndex(
      (contact) => contact === receiverUsername
    );

    if (contactIndex === -1) {
      return res
        .status(200)
        .json({ message: "You are not friends with this user." });
    }

    // Delete receiver from sender's contactList
    sender.contactList.splice(contactIndex, 1);
    await sender.save();

    // Delete sender from receiver's contactList
    const senderIndex = receiver.contactList.findIndex(
      (contact) => contact === senderUsername
    );
    if (senderIndex !== -1) {
      receiver.contactList.splice(senderIndex, 1);
      await receiver.save();
    }

    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});
///////////////////////////////////

router.post("/cancelRequest", async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    let decoded;
    try {
      // Decode the token to get the user id
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(200).json({ error: "Invalid or expired token" });
    }

    const senderUsername = decoded.username;
    const sender = await User.findOne({ username: senderUsername });

    if (!sender) {
      return res.status(200).json({ error: "Sender not found" });
    }

    const receiverUsername = req.body.receiverUsername;
    const receiver = await User.findOne({ username: receiverUsername });

    if (!receiver) {
      return res.status(200).json({ error: "Receiver not found" });
    }

    // Find and remove request from sender's pendingContactRequests
    const senderRequestIndex = sender.pendingContactRequests.findIndex(
      (request) => request.receiver === receiverUsername
    );
    if (senderRequestIndex !== -1) {
      sender.pendingContactRequests.splice(senderRequestIndex, 1);
      await sender.save();
    } else {
      return res.status(400).json({ message: "No pending request to cancel" });
    }

    // Find and remove request from receiver's receivedContactRequests
    const receiverRequestIndex = receiver.receivedContactRequests.findIndex(
      (request) =>
        request.sender === senderUsername && request.status === "pending"
    );
    if (receiverRequestIndex !== -1) {
      receiver.receivedContactRequests.splice(receiverRequestIndex, 1);
      await receiver.save();
    }

    res.json({ message: "Friend request cancelled" });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

module.exports = router;
