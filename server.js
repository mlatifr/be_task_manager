const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Simulasi Database (List of Objects)
// Sama seperti List<TaskModel> di Flutter
let tasks = [
    {
        id: "1",
        title: "Belajar Backend Node.js",
        description: "Membuat API sederhana",
        status: "todo",
        dueDate: new Date().toISOString()
    }
];

// --- ROUTES (API Endpoints) ---

// 1. GET ALL TASKS (Read)
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// 2. POST NEW TASK (Create)
app.post('/tasks', (req, res) => {
    const newTask = {
        id: Date.now().toString(), // Generate ID unik sederhana
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        dueDate: req.body.dueDate
    };
    tasks.push(newTask);
    res.status(201).json(newTask); // Kirim balik data yang baru dibuat
});

// 3. PUT UPDATE TASK (Update)
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const index = tasks.findIndex(t => t.id === id);

    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...req.body };
        res.json(tasks[index]);
    } else {
        res.status(404).json({ message: "Task tidak ditemukan" });
    }
});

// 4. DELETE TASK (Delete)
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    tasks = tasks.filter(t => t.id !== id);
    res.json({ message: "Berhasil dihapus" });
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
});
