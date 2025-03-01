import express from "express";
import cors from "cors";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";
const _dirname = dirname(fileURLToPath(import.meta.url));


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


app.post("/predict", (req, res) => {
    const inputData = req.body.input;

    const pythonProcess = spawn("python", ["./src/app.py", JSON.stringify(inputData)]);

    pythonProcess.stdout.on("data", (data) => {
        res.json({ prediction: data.toString().trim() });
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`Error: ${data}`);
        res.status(500).json({ error: "Python script error" });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
