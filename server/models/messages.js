const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const messageSchema = new mongoose.Schema({
    chatRoom: { type: ObjectId, ref: 'ChatRoom' },   // Reference to chatRoom
    sender: { type: ObjectId, ref: 'User' },         // The message sender
    receiver: { type: ObjectId, ref: 'User' },       // The message receiver
    text: { type: String, required: true },          // Message content
    createdAt: { type: Date, default: Date.now }     // Timestamp
});

module.exports = mongoose.model('Message', messageSchema);
