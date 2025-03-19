import express from 'express';
import fileUpload from "express-fileupload";
import path from 'path';
import fs from "fs";
import { fileURLToPath } from 'url';
import { loadData } from './utils/loadData.js';
import { generateText } from './services/sttTool.js';
import { generateSpeech } from './services/ttsTool.js';
import { chain } from './services/chain.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Performing graceful shutdown...');
    server.close(() => {
        console.log("Server closed. Performing cleanup...");

        cleanup();

        console.log("Cleanup complete. Exiting process.");
        process.exit(0);
    });
});

// Cleanup function
const cleanup = () => {
    // Clean up uploads directory
    if (fs.existsSync("./uploads")) {
        fs.readdirSync("./uploads").forEach(file => {
            fs.unlinkSync(`./uploads/${file}`);
        });
    }
};

// Memory monitoring
setInterval(() => {
    const used = process.memoryUsage();
    console.log(`Memory usage - RSS: ${Math.round(used.rss / 1024 / 1024)}MB, Heap: ${Math.round(used.heapUsed / 1024 / 1024)}MB`);
}, 30000);

// Middleware
app.use(express.static(path.join(__dirname, '../../client/dist')));
app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    abortOnLimit: true
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.post('/loadData', async (req, res) => {
    try {
        const { data } = req.body;
        await loadData(data);
        res.status(200).json('Data successfully loaded');
    } catch (error) {
        console.error('Error in loadData:', error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});

app.post('/generateText', async (req, res) => {
    let tempPath = null;
    try {
        if (!req.files || !req.files.audio) {
            return res.status(400).json({ error: "No audio file provided" });
        }

        const audioFile = req.files.audio;
        tempPath = `./uploads/${Date.now()}-${audioFile.name}`;

        if (!fs.existsSync("./uploads")) {
            fs.mkdirSync("./uploads");
        }

        await audioFile.mv(tempPath);
        const text = await generateText(tempPath);
        res.json({ text });
    } catch (error) {
        console.error("Error in generateText:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    } finally {
        // Cleanup temp file
        if (tempPath && fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
        }
    }
});

app.post('/generateSpeech', async (req, res) => {
    try {
        const { input } = req.body;
        if (!input || input.length > 1000) { // Limit input length
            return res.status(400).json({ error: "Invalid input length" });
        }
        const speechFile = await generateSpeech(input);
        const buffer = Buffer.from(speechFile);
        res.set('Content-Type', 'audio/mpeg');
        res.status(200).send(buffer);
    } catch (error) {
        console.error('Error in generateSpeech:', error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});

app.post('/processQuery', async (req, res) => {
    try {
        const { history, query } = req.body;
        if (!query || (history && !Array.isArray(history))) {
            return res.status(400).json({ error: "Invalid input format" });
        }
        const response = await chain.invoke({ history, query });
        res.status(200).json({ response });
    } catch (error) {
        console.error('Error in processQuery:', error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});

// Catch-all route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Memory limit: ${process.env.NODE_OPTIONS || 'default'}`);
});