const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();
const secretKey = 'your-secret-key'; // Utilisez une clé secrète sécurisée

// Inscription
router.post('/register', async (req, res) => {
    const { email, password, role, firstName, lastName, companyName, age, gender, educationLevel, nativeLanguage, phoneNumber, street, city, postalCode, country, activityType, activitySummary } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const result = await pool.query('INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING user_id', [email, hashedPassword, role]);
        const userId = result.rows[0].user_id;

        if (role === 'client') {
            await pool.query('INSERT INTO client (user_id, first_name, last_name, age, gender, education_level, native_language, email, phone_number, street, city, postal_code, country) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', 
                [userId, firstName, lastName, age, gender, educationLevel, nativeLanguage, email, phoneNumber, street, city, postalCode, country]);
        } else if (role === 'laboratory') {
            await pool.query('INSERT INTO laboratory (user_id, company_name, email, phone_number, street, city, postal_code, country, activity_type, activity_summary) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', 
                [userId, companyName, email, phoneNumber, street, city, postalCode, country, activityType, activitySummary]);
        }

        res.status(201).send({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});


// Connexion
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT user_id, password, role FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(400).send({ message: 'User not found' });

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).send({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.user_id, role: user.role }, secretKey, { expiresIn: '1h' });
        res.status(200).send({ token });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

module.exports = router;
