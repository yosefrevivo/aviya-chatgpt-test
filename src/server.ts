import express, { Application } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import OpenAI from 'openai';

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server);

// Set up OpenAI API
const openai = new OpenAI({
    apiKey: 'sk-proj-lU2uaGRRv82kpnqkniGET3BlbkFJH4zDmXwxKIiUWAXpHv33',
});

// Serve static files (for client, if needed)
app.use(express.static('public'));

// Handle Socket.io connections
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('chat message', async (msg: string) => {
        console.log('message: ' + msg);

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo-0125',
                messages: [{ role: 'user', content: msg }],
            });

            const aiResponse = response.choices[0].message.content;
            socket.emit('chat response', aiResponse);
        } catch (error) {
            console.error('Error communicating with OpenAI:', error);
            socket.emit('chat response', 'Error communicating with OpenAI');
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
