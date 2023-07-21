// Importing the necessary modules and environmental variables
const express = require("express");
const ConversationDocument = require("../models/conversationModel");

// Creating a new Express Router instance
const router = express.Router();

///////////////////////////////
// Example to test connection:
// Pre-defined users
const users = [
  {
    email: "CONVERSATION@example.com",
    username: "CONVERSATION",
    password: "password123",
  },
  {
    email: "janeCONVERSATION@example.com",
    username: "janeCONVERSATION",
    password: "password123",
  },
];

// Endpoint to fetch users
router.get("/users", (req, res) => {
  res.json(users);
});

/////////////////////////

router.post("/sendMessage", async (req, res) => {
  // Extract parameters from the request body
  const { sender, receiver, id, content } = req.body;

  try {
    let chat;

    if (id) {
      // CASE 2: Conversation already exists
      chat = await ConversationDocument.findById(id);

      // Check if conversation exists
      if (!chat) {
        return res.status(200).json({ error: "Conversation not found" });
      }

      // Check if sender is part of the conversation
      if (!chat.participants.includes(sender)) {
        return res
          .status(200)
          .json({ error: "Sender not part of the conversation" });
      }
    } else {
      // CASE 1: New conversation
      chat = new ConversationDocument({
        participants: [sender, receiver],
        conversation: [],
      });
      await chat.save();
    }

    // Construct the message object
    const message = {
      sender,
      receiver,
      content,
      date: new Date(),
      index: chat.conversation.length, // Assuming we're incrementing the index with each new message
    };

    // Add the message to the conversation
    chat.conversation.push(message);

    // Save the updated conversation
    await chat.save();

    // Send back the chat ID and receivers
    res.status(200).json({
      chatID: chat._id,
      receivers: chat.participants.filter(
        (participant) => participant !== sender
      ),
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

///////////////////////////////
router.post("/createGroupConversation", async (req, res) => {
  // Extract parameters from the request body
  const { creator, participants } = req.body;

  try {
    // Add the creator to the participants list
    const allParticipants = [...participants, creator];

    // Create a new conversation
    const chat = new ConversationDocument({
      participants: allParticipants,
      conversation: [],
    });

    // Save the conversation
    await chat.save();

    // Send back the conversation ID and participants
    res.status(200).json({ chatID: chat._id, participants: allParticipants });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

module.exports = router;
