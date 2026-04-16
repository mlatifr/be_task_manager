const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Task } = require('./models');
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
// Sekarang Task.findAll() akan berfungsi
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. POST NEW TASK (Create ke MySQL)
app.post('/tasks', async (req, res) => { // Tambahkan 'async'
    try {
        // Gunakan Task.create agar tersimpan ke MySQL
        const newTask = await Task.create({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            dueDate: req.body.dueDate
        });

        // Response ini otomatis akan mengandung ID dari MySQL
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 3. PUT UPDATE TASK (Update)
app.put('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;


        const task = await Task.findByPk(id);


        if (task) {

            await task.update({
                title: req.body.title,
                description: req.body.description,
                status: req.body.status,
                dueDate: req.body.dueDate
            });


            return res.json(task);
        }


        return res.status(404).json({ message: "Task tidak ditemukan di MySQL" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
});


// 4. DELETE TASK (Delete)
app.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Task.destroy({
            where: { id: id }
        });

        if (result === 1) {
            res.json({ message: "Berhasil dihapus dari Database" });
        } else {
            res.status(404).json({ message: "Gagal: ID tidak ditemukan di database" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
});
