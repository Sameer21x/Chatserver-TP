const express = require('express');
const router = express.Router();
const chatRoomController = require('../../server/Controller/Chat');

// Route for sending a message
router.post('/send-message', chatRoomController.sendMessage);

// Route for getting previous messages
router.get('/get-messages', chatRoomController.getChatRoomMessages);

module.exports = router;
