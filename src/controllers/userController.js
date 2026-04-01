const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Setup Nodemailer transporter for Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insert new user
        const result = await db.query(
            'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, password_hash]
        );

        const newUser = result.rows[0];

        // Generate JWT
        const payload = { id: newUser.id, email: newUser.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

        // Send Welcome Email asynchronously
        try {
            await transporter.sendMail({
                from: `"Daycare Discovery" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Welcome to Daycare Discovery!',
                text: `Hi ${name},\n\nWelcome to Daycare Discovery Platform. We're excited to help you find the best childcare options for your family.\n\nBest Regards,\nThe Daycare Discovery Team`
            });
            console.log("Email sent successfully!");
        } catch (error) {
            console.error("Email failed:", error);
        }

        res.status(201).json({ token, user: newUser });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check user
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const payload = { id: user.id, email: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        next(err);
    }
};

// Favorites Logic
exports.getFavorites = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await db.query(
            `SELECT d.* FROM daycares d
             JOIN saved_daycares sd ON d.id = sd.daycare_id
             WHERE sd.user_id = $1
             ORDER BY sd.created_at DESC`,
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};

exports.addFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { daycareId } = req.body;

        if (!daycareId) return res.status(400).json({ error: 'Daycare ID required' });

        await db.query(
            'INSERT INTO saved_daycares (user_id, daycare_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [userId, daycareId]
        );

        res.status(201).json({ message: 'Daycare saved successfully' });
    } catch (err) {
        next(err);
    }
};

exports.removeFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const daycareId = req.params.daycareId;

        await db.query(
            'DELETE FROM saved_daycares WHERE user_id = $1 AND daycare_id = $2',
            [userId, daycareId]
        );

        res.json({ message: 'Daycare removed from favorites' });
    } catch (err) {
        next(err);
    }
};

// Dashboard Logic
exports.getUserDashboard = async (req, res, next) => {
    try {
        const userId = req.user.id;
        // Fetch saved daycares using JOIN
        const savedDaycaresResult = await db.query(
            `SELECT d.* FROM daycares d
             JOIN saved_daycares sd ON d.id = sd.daycare_id
             WHERE sd.user_id = $1
             ORDER BY sd.created_at DESC`,
            [userId]
        );

        res.json({ savedDaycares: savedDaycaresResult.rows });
    } catch (err) {
        next(err);
    }
};

exports.getUserInquiries = async (req, res, next) => {
    try {
        const userId = req.user.id;
        // Fetch inquiries for user, joining with daycares to get the name if not stored, 
        // though we did store parent_name, let's join to get the real daycare name.
        const inquiriesResult = await db.query(
            `SELECT i.*, d.name AS daycare_name 
             FROM inquiries i
             JOIN daycares d ON i.daycare_id = d.id
             WHERE i.user_id = $1
             ORDER BY i.created_at DESC`,
            [userId]
        );

        res.json(inquiriesResult.rows);
    } catch (err) {
        next(err);
    }
};
