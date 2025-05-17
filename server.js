const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
dotenv.config();
const connectDB = require('./config/db');
connectDB();
const Stream = require('./models/stream'); 
const app = express();
app.use(express.json());


const streamRouter = require('./router/streamRouter');
app.use('/api/stream', streamRouter);

const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});

async function updateStreamViews(streamKey, count) {
    try {
      await Stream.findOneAndUpdate(
        { streamKey },
        { $set: { views: count } },
        { new: true }
      );
    } catch (error) {
      console.error(`Failed to update views for streamKey ${streamKey}:`, error);
    }
  }

io.on('connection', (socket) => {
  
    socket.on('joinRoom', async (streamKey) => {
      if (!streamKey) return;
  
      // Verify if the streamKey exists in the database
      const streamExists = await Stream.exists({ streamKey });
      if (!streamExists) {
        socket.emit('error', 'Invalid stream key.');
        return;
      }
  
      socket.join(streamKey);
    
      // Send the current number of watching users in the room
      const roomSize = io.sockets.adapter.rooms.get(streamKey)?.size || 0;
      io.to(streamKey).emit('views', roomSize);
  
      // Update the views count in the database
      await updateStreamViews(streamKey, roomSize);
    });
  
    // Handle incoming chat messages
    socket.on('chatMessage', ({ streamKey, message }) => {
      if (!streamKey || !message) return;
  
      /**
       * this is for sending the messages to a room chat with the stream key 
       * and the message would look something like this (all the data are from the front end ): 
       * {
       *    id:user_id , 
       *    name : user_name,
       *    avatar : // url to the avatar 
       *    text : // the message data that will show to the user 
       * }
       */
      socket.to(streamKey).emit('chatMessage', {
        message,
      });
    });
  
    // Handle user disconnection
    socket.on('disconnecting', async () => {
      for (const room of socket.rooms) {
        if (room !== socket.id) {
            
          // Calculate the new room size after disconnection
          const roomSize = (io.sockets.adapter.rooms.get(room)?.size || 1) - 1;
          io.to(room).emit('views', roomSize);
  
          // Update the views count in the database
          await updateStreamViews(room, roomSize);
        }
      }
    });
  
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
  
  // Start the server
  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
  });