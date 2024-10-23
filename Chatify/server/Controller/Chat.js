const ChatRoom = require('../models/chatrooms');
// const { v4: uuidv4 } = require('uuid');

// Generate a unique room ID based on senderId and receiverId
const generateRoomId = (senderId, receiverId) => {
    const sortedIds = [senderId, receiverId].sort();
    return `${sortedIds[0]}_${sortedIds[1]}`; // Ensures the same ID regardless of order
};

// Send a message in a chat room
const sendMessage = async (req, res) => {
    const { senderId, receiverId, message } = req.body;

    if (!senderId || !receiverId || !message) {
        return res.status(400).json({ error: 'Sender, receiver, and message are required' });
    }

    // Generate roomId for the chat between sender and receiver
    const roomId = generateRoomId(senderId, receiverId);

    try {
        // Find the chat room by roomId, or create a new one if it doesn't exist
        let chatRoom = await ChatRoom.findOne({ roomId });

        if (!chatRoom) {
            // Create a new chat room if it doesn't exist
            chatRoom = new ChatRoom({
                roomId,
                senderId,
                receiverId,
                messages: []
            });
        }

        // Add the new message to the chat room's messages array
        const newMessage = {
            sender: senderId,
            message,
            timestamp: new Date(),
        };
        chatRoom.messages.push(newMessage);

        // Save the chat room with the new message
        await chatRoom.save();

        // Emit the message to all clients in the room
        req.app.get('io').to(roomId).emit('chat', { senderId, message, timestamp: newMessage.timestamp });

        // Return the room's _id and the chatRoom itself
        return res.status(200).json({ message: 'Message sent successfully', chatRoomId: chatRoom._id, chatRoom });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to send message' });
    }
};

// Retrieve previous conversations by roomId
const getChatRoomMessages = async (req, res) => {
    const { roomId } = req.query; // Extract roomId from query parameters

    if (!roomId) {
        return res.status(400).json({ error: 'Room ID is required' });
    }

    try {
        // Find the chat room by roomId
        const chatRoom = await ChatRoom.findOne({ roomId });

        if (!chatRoom) {
            return res.status(404).json({ message: 'No previous conversation found for this room' });
        }

        // Return all data in the chat room, including _id and messages
        return res.status(200).json(chatRoom);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to retrieve messages' });
    }
};

// Fetch all chat rooms
const getAllChatRooms = async (req, res) => {
    try {
        // Retrieve all chat rooms from the database
        const chatRooms = await ChatRoom.find();

        // If no chat rooms exist, send a 404 response
        if (!chatRooms || chatRooms.length === 0) {
            return res.status(404).json({ message: 'No chat rooms found' });
        }

        // Return the chat rooms in the response
        return res.status(200).json(chatRooms);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to retrieve chat rooms' });
    }
};


module.exports = {
    sendMessage,
    getChatRoomMessages,
    getAllChatRooms
};
