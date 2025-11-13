import express from "express";
import cors from "cors";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path"; // Import 'join'


const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); // This replaces the need for bodyParser

app.post("/predict", (req, res) => {
    const inputData = req.body.input;



    const pythonExecutable = join(__dirname, "src", "venv", "Scripts", "python.exe");
    const pythonScript = join(__dirname, "src", "app.py");

    const pythonProcess = spawn(pythonExecutable, [pythonScript, JSON.stringify(inputData)]);


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

    
    pythonProcess.on("error", (err) => {
        console.error(`Failed to start Python process: ${err}`);
        if (!responseSent) {
            responseSent = true;
            res.status(500).json({ error: "Failed to start Python process", details: err.message });
        }
    });

    
    pythonProcess.on("close", (code) => {
        console.log(`Python process exited with code ${code}`);

    
        if (responseSent) return;

        responseSent = true;

        
        if (code !== 0 || stderrData) {
            console.error(`stderr: ${stderrData}`);
            res.status(500).json({ error: "Python script error", details: stderrData.trim() });
        } else {
        
            res.json({ prediction: stdoutData.trim() });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});