const express = require('express');
const pool = require('./db');
const port = 3000;

const app = express();
app.use(express.json());

// Import des routes
const clientRoutes = require('./routes/clientRoutes');
const laboratoryRoutes = require('./routes/laboratoryRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const authRoutes = require('./routes/authRoutes'); // Nouveau

// Import des middlewares
const authenticateToken = require('./middlewares/authenticateToken');
const authorizeRoles = require('./middlewares/authorizeRoles');

// Utilisation des routes
app.use('/auth', authRoutes); // Nouveau

app.use('/client', authenticateToken, authorizeRoles('client'), clientRoutes);
app.use('/laboratory', authenticateToken, authorizeRoles('laboratory'), laboratoryRoutes);
app.use('/announcement', authenticateToken, authorizeRoles('laboratory'), announcementRoutes);

// Route de configuration
app.get('/setup', async (req, res) => {
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            role VARCHAR(50) NOT NULL CHECK (role IN ('client', 'laboratory'))
        )`);

        await pool.query(`CREATE TABLE IF NOT EXISTS client (
            client_id SERIAL PRIMARY KEY,
            first_name VARCHAR(100),
            last_name VARCHAR(100),
            age INT,
            gender VARCHAR(10),
            education_level VARCHAR(100),
            native_language VARCHAR(100),
            email VARCHAR(100),
            phone_number VARCHAR(100),
            street VARCHAR(100),
            city VARCHAR(100),
            postal_code VARCHAR(20),
            country VARCHAR(100),
            user_id INT REFERENCES users(user_id)
        )`);

        await pool.query(`CREATE TABLE IF NOT EXISTS laboratory (
            laboratory_id SERIAL PRIMARY KEY,
            company_name VARCHAR(100),
            email VARCHAR(100),
            phone_number VARCHAR(100),
            street VARCHAR(100),
            city VARCHAR(100),
            postal_code VARCHAR(20),
            country VARCHAR(100),
            activity_type VARCHAR(100),
            activity_summary TEXT,
            user_id INT REFERENCES users(user_id)
        )`);

        await pool.query(`CREATE TABLE IF NOT EXISTS announcement (
            announcement_id SERIAL PRIMARY KEY,
            laboratory_id INT,
            name VARCHAR(100),
            remuneration VARCHAR(100),
            description TEXT,
            days INT,
            duration VARCHAR(100),
            client_gender VARCHAR(10),
            client_education_level VARCHAR(100),
            client_native_language VARCHAR(100),
            client_age_min INT,
            client_age_max INT,
            street VARCHAR(100),
            city VARCHAR(100),
            postal_code VARCHAR(20),
            country VARCHAR(100),
            FOREIGN KEY (laboratory_id) REFERENCES laboratory(laboratory_id)
        )`);

        res.status(200).send({
            message: "Tables created successfully"
        });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.listen(port, () => console.log(`Server has started on port: ${port}`));
