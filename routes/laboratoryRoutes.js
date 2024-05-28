const express = require('express');
const router = express.Router();
const pool = require('../db');

// Définition des routes pour les laboratoires

router.get('/', async (req, res) => {
    try {
        const data = await pool.query('SELECT laboratory_id, company_name, email, phone_number, street, city, postal_code, country, activity_type, activity_summary FROM laboratory');
        res.status(200).send(data.rows);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

router.post('/', async (req, res) => {
    const {
        company_name,
        email,
        phone_number,
        address,
        activity_type,
        activity_summary
    } = req.body.laboratory; // Accéder à req.body.laboratory

    try {
        await pool.query('INSERT INTO laboratory(company_name, email, phone_number, street, city, postal_code, country, activity_type, activity_summary) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [company_name, email, phone_number, address.street, address.city, address.postal_code, address.country, activity_type, activity_summary]);
        res.status(200).send({
            message: "Laboratory added successfully"
        });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});


module.exports = router;
