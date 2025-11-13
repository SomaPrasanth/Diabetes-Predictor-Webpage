import express from "express";
import cors from "cors";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path"; // Import 'join'

// This assumes app.js is in the root of your "Diabetes Preditor" folder
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); // This replaces the need for bodyParser

app.post("/predict", (req, res) => {
    const inputData = req.body.input;

    // --- Fix 1: Use the explicit Python executable from your virtual environment ---
    // This solves ModuleNotFoundError by using the correct Python instance
    const pythonExecutable = join(__dirname, "src", "venv", "Scripts", "python.exe");
    const pythonScript = join(__dirname, "src", "app.py");

    const pythonProcess = spawn(pythonExecutable, [pythonScript, JSON.stringify(inputData)]);

    // --- Fix 2: Buffer data and send response only once ---
    let stdoutData = "";
    let stderrData = "";
    let responseSent = false; // Flag to prevent double-sending responses

    // Listen for stdout data
    pythonProcess.stdout.on("data", (data) => {
        stdoutData += data.toString();
    });

    // Listen for stderr data
    pythonProcess.stderr.on("data", (data) => {
        stderrData += data.toString();
    });

    // Handle errors in spawning the process itself
    pythonProcess.on("error", (err) => {
        console.error(`Failed to start Python process: ${err}`);
        if (!responseSent) {
            responseSent = true;
            res.status(500).json({ error: "Failed to start Python process", details: err.message });
        }
    });

    // Listen for the process to exit
    pythonProcess.on("close", (code) => {
        console.log(`Python process exited with code ${code}`);

        // If a response was already sent (e.g., by the 'error' event), do nothing.
        if (responseSent) return;

        responseSent = true;

        // If there was an error (non-zero exit code or data in stderr)
        if (code !== 0 || stderrData) {
            console.error(`stderr: ${stderrData}`);
            res.status(500).json({ error: "Python script error", details: stderrData.trim() });
        } else {
            // Success: send the buffered stdout data
            res.json({ prediction: stdoutData.trim() });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});