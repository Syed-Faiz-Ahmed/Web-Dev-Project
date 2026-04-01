const db = require('../config/db');
const nodemailer = require('nodemailer');

// Reuse existing Gmail transporter setup from user registration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.createInquiry = async (req, res, next) => {
    try {
        // user_id can be optional depending on if they are logged in.
        // If we use auth middleware, it might be in req.user.id. Otherwise undefined.
        const user_id = req.user ? req.user.id : null;

        const { daycare_id, parent_name, parent_email, child_age, message, daycare_name } = req.body;

        if (!daycare_id || !parent_name || !parent_email || !child_age || !message) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // 1. Insert into database
        const result = await db.query(
            `INSERT INTO inquiries 
            (user_id, daycare_id, parent_name, parent_email, child_age, message) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [user_id, daycare_id, parent_name, parent_email, child_age, message]
        );

        const newInquiry = result.rows[0];

        // 2. Send Two-Way Emails (Admin Notification & Parent Receipt)
        // Fallback daycare_name just in case it wasn't passed from frontend.
        const daycareNameDisplay = daycare_name || 'the facility';

        try {
            // Admin Notification (To Me)
            await transporter.sendMail({
                from: `"Daycare Discovery" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_USER,
                replyTo: parent_email,
                subject: `New Lead: Inquiry from ${parent_name}`,
                text: `New Inquiry Received:\n\nParent Name: ${parent_name}\nEmail: ${parent_email}\nChild Age: ${child_age}\nDaycare Name: ${daycareNameDisplay}\n\nMessage:\n"${message}"`
            });
            console.log("Admin notification email sent successfully!");

            // Parent Receipt (To the User)
            await transporter.sendMail({
                from: `"Daycare Discovery" <${process.env.EMAIL_USER}>`,
                to: parent_email,
                subject: `Inquiry Received - ${daycareNameDisplay}`,
                text: `Hello ${parent_name}, thank you for your inquiry for ${daycareNameDisplay}. We have received your details and will contact you shortly.`
            });
            console.log("Parent receipt email sent successfully!");
        } catch (emailErr) {
            console.error("Email failed:", emailErr);
            // We do not fail the request if the email fails, we still saved the inquiry
        }

        res.status(201).json({ message: 'Inquiry submitted successfully', inquiry: newInquiry });
    } catch (err) {
        next(err);
    }
};

exports.updateInquiryStatus = async (req, res, next) => {
    try {
        const inquiryId = req.params.id;

        // 1. Fetch current status
        const selectResult = await db.query('SELECT status FROM inquiries WHERE id = $1', [inquiryId]);

        if (selectResult.rows.length === 0) {
            return res.status(404).json({ error: 'Inquiry not found' });
        }

        const currentStatus = selectResult.rows[0].status || 'Sent';

        // 2. Determine next logical status in the timeline
        let nextStatus = 'Sent';
        if (currentStatus === 'Sent') {
            nextStatus = 'Viewed';
        } else if (currentStatus === 'Viewed') {
            nextStatus = 'Replied';
        } else {
            // If it's already replied, we just leave it or return a distinct message
            return res.status(200).json({ message: 'Inquiry is already fully resolved.', status: currentStatus });
        }

        // 3. Update database
        const updateResult = await db.query(
            'UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING *',
            [nextStatus, inquiryId]
        );

        res.status(200).json({
            message: 'Inquiry status updated successfully',
            inquiry: updateResult.rows[0]
        });

    } catch (err) {
        next(err);
    }
};
