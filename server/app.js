const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');
const port = 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const chatRoutes = require('../server/Routes/chatRoutes');

const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*"
    }
});

// MongoDB connection
mongoose.connect('mongodb+srv://sameer:Sam123@atlascluster.ot9wtsx.mongodb.net/ChatApp?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Use chat routes
app.use('/api', chatRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the Chat Server! Everything is working fine.');
});

app.set('io', io);

// Socket.IO connection logic
io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle joining a room
    socket.on('joinRoom', ({ roomId, senderId }) => {
        if (!roomId || !senderId) {
            return socket.emit('error', { message: 'Room ID and Sender ID are required' });
        }
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('userJoined', { senderName: senderId });
        console.log(`Client ${senderId} joined room: ${roomId}`);
    });

    // Handle leaving a room
    socket.on('leaveRoom', ({ roomId, senderId }) => {
        if (!roomId || !senderId) {
            return socket.emit('error', { message: 'Room ID and Sender ID are required to leave the room' });
        }
        socket.leave(roomId);
        socket.broadcast.to(roomId).emit('userLeft', { senderName: senderId });
        console.log(`Client ${senderId} left room: ${roomId}`);
    });

    // // Handle sending a chat message
    // socket.on('chat', async ({ roomId, senderId, message }) => {
    //     if (!roomId || !senderId || !message) {
    //         return socket.emit('error', { message: 'Room ID, Sender ID, and message are required' });
    //     }
    //     io.to(roomId).emit('chat', { senderId, message });
    //     console.log(`Message sent to room ${roomId}: ${message}`);
    // });

    // Handle client disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
