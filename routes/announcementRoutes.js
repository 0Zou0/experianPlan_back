const express = require('express');
const router = express.Router();
const pool = require('../db');

// Définition des routes pour les annonces

//GET
router.get('/', async (req, res) => {
    try {
        const data = await pool.query(`SELECT announcement_id, laboratory_id, name, remuneration, description, client_gender, client_age_min, client_age_max, client_education_level, client_native_language, street, city, postal_code, country, days, duration FROM announcement`);
        const formattedData = data.rows.map(row => ({
            ...row,
            patient_characteristics: {
                age_range: {
                    age_min: row.client_age_min,
                    age_max: row.client_age_max
                }
            }
        }));
        res.status(200).send(formattedData);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

//POST
router.post('/', async (req, res) => {
    const {
        laboratory_id,
        experience_name,
        remuneration,
        description,
        days,
        duration,
        client_gender,
        client_education_level,
        client_native_language,
        client_age_min,
        client_age_max,
        street,
        city,
        postal_code,
        country
    } = req.body.announcement;

    try {
        await pool.query('INSERT INTO announcement(laboratory_id, name, remuneration, description, days, duration, client_gender, client_education_level, client_native_language, client_age_min, client_age_max, street, city, postal_code, country) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
            [laboratory_id, experience_name, remuneration, description, days, duration, client_gender, client_education_level, client_native_language, client_age_min, client_age_max, street, city, postal_code, country]);
        res.status(200).send({
            message: "Announcement added successfully"
        });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});




module.exports = router;
