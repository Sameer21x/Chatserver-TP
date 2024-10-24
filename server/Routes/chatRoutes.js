// chatRoutes.js
const express = require('express');
const router = express.Router();
const { sendMessage,initializeChat, getChatRoomMessages,getAllChatRooms } = require('../Controller/Chat');

// Route for sending a message
router.post('/messages', sendMessage);
router.post('/initializechat',initializeChat);

// Route for retrieving messages from a chat room
router.get('/messages', getChatRoomMessages);

router.get('/chatrooms', getAllChatRooms);

module.exports = router;
