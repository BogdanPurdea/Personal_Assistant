import express from 'express';
import fileUpload from "express-fileupload";
import path from 'path';
import fs from "fs";
import { fileURLToPath } from 'url';
import { loadData } from './utils/loadData.js';
import { generateText } from './utils/sttTool.js';
import { generateSpeech } from './utils/ttsTool.js';
import { chain } from './utils/chain.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "dist" directory (built by Vite)
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.json());
app.use(fileUpload());
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.post('/loadData', async (req, res) => {
	try {
		const { data } = req.body;
		await loadData(data);
		res.status(200).json('Data successfully loaded');
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: error.message || "Internal server error" });
	}
});


app.post('/generateText', async (req, res) => {
	try {
        if (!req.files || !req.files.audio) {
            return res.status(400).json( { error: error.message || "Internal server error" } );
        }

        const audioFile = req.files.audio;
        const tempPath = `./uploads/${audioFile.name}`;

        if (!fs.existsSync("./uploads")) {
            fs.mkdirSync("./uploads");
        }

        audioFile.mv(tempPath, async (err) => {
            if (err) {
                return res.status(500).json({ error: error.message || "Internal server error" });
            }

            try {
                const text = await generateText(tempPath);
                fs.unlinkSync(tempPath); // Cleanup
                res.json({ text });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: error.message || "Internal server error" });
            }
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});

app.post('/generateSpeech', async (req, res) => {
	try {
		const { input } = req.body;
		const speechFile = await generateSpeech(input);
        const buffer = Buffer.from(speechFile); // Convert ArrayBuffer to Buffer
        res.set('Content-Type', 'audio/mpeg'); // Set the correct Content-Type header
        res.status(200).send(buffer);
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: error.message || "Internal server error" });
	}
});

app.post('/processQuery', async (req, res) => {
	try {
		const { history, query } = req.body;
		const response = await chain.invoke({ history, query });
		res.status(200).json({ response });
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: error.message || "Internal server error" });
	}
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
