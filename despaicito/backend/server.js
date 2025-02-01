const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// 📌 Kullanıcıları getir (GET)
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Kullanıcı ekle (POST)
app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    try {
        await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
        res.status(201).json({ message: 'Kullanıcı eklendi' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Kullanıcı ve konularına göre flashcard'ları getir (GET)
app.get('/users/:userId/flashcards/:subject', async (req, res) => {
    const { userId, subject } = req.params;
    try {
        const result = await pool.query(
            'SELECT f.* FROM flashcards f JOIN users u ON f.user_id = u.id WHERE u.id = $1 AND f.subject = $2',
            [userId, subject]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('✅ Server 3000 portunda çalışıyor');
});
