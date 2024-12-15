const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "@Ak9164216833",
    database: "TodoApp",
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the MySQL database.");
});

app.post("/tasks", (req, res) => {
    const { text, startDate, endDate, containerId } = req.body;

    if (!containerId) {
        return res.status(400).json({ message: "Container ID is missing." });
    }

    const lastModified = new Date().toISOString().slice(0, 19).replace("T", " ");
    const checked = false;

    const query = `
        INSERT INTO tasks (container_id, text, start_date, end_date, last_modified, checked) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [containerId, text, startDate, endDate, lastModified, checked], (err, result) => {
        if (err) {
            console.error("Error inserting task:", err.message);
            console.error("SQL Error Code:", err.code);
            console.error("SQL State:", err.sqlState);
            console.error("Error inserting task:", err);
            res.status(500).json({ message: "Error adding task." });
        } else {
            res.status(200).json({ message: "Task added successfully.", taskId: result.insertId });
        }
    });
});

app.get("/tasks", (req, res) => {
    const { containerId } = req.query;
    db.query("SELECT * FROM tasks WHERE container_id = ?", [containerId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ tasks: results });
    });
});

app.post("/tasks", (req, res) => {
    const { text, startDate, endDate, containerId } = req.body;
    const query = "INSERT INTO tasks (text, start_date, end_date, container_id) VALUES (?, ?, ?, ?)";
    db.query(query, [text, startDate, endDate, containerId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ taskId: result.insertId });
    });
});

app.put("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    const query = "UPDATE tasks SET text = ? WHERE id = ?";
    db.query(query, [text, id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.sendStatus(200);
    });
});

app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM tasks WHERE id = ?";
    db.query(query, [id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.sendStatus(200);
    });
});

app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM tasks WHERE id = ?";
    db.query(query, [id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.sendStatus(200);
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
