const mongoose = require('mongoose');

// Define the ChatRoom schema
const chatRoomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true, // Ensure roomId is unique
    },
    senderId: {
        type: String,
        required: true,
    },
    receiverId: {
        type: String,
        required: true,
    },
    messages: [{
        sender: String,
        message: String,
        timestamp: {
            type: Date,
            default: Date.now,
        },
    }],
}, {
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt'
});

// Create and export the ChatRoom model
const ChatRoom = mongoose.model('ChatRooms', chatRoomSchema);

module.exports = ChatRoom;
