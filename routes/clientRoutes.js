const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middlewares/authenticateToken');

// Middleware d'authentification
router.use(authenticateToken);

// GET clients pour l'utilisateur connecté
router.get('/', async (req, res) => {
    try {
        const data = await pool.query('SELECT client_id, first_name, last_name, email, phone_number, age, gender, street, city, postal_code, country, education_level, native_language FROM client WHERE user_id = $1', [req.user.user_id]);
        res.status(200).send(data.rows);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// POST client pour l'utilisateur connecté
router.post('/', async (req, res) => {
    const {
        first_name,
        last_name,
        email,
        phone_number,
        age,
        gender,
        education_level,
        native_language,
        address
    } = req.body.client;

    try {
        await pool.query('INSERT INTO client(first_name, last_name, email, phone_number, age, gender, street, city, postal_code, country, education_level, native_language, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
            [first_name, last_name, email, phone_number, age, gender, address.street, address.city, address.postal_code, address.country, education_level, native_language, req.user.user_id]);
        res.status(200).send({
            message: "Client added successfully"
        });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

module.exports = router;
