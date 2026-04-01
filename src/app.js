const express = require('express');
const app = express();
const daycareRoutes = require('./routes/daycareRoute');
const userRoutes = require('./routes/userRoute');
const inquiryRoutes = require('./routes/inquiryRoute');

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/daycares', daycareRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inquiries', inquiryRoutes);

// Base route
app.get('/', (req, res) => {
    res.send('Daycare Discovery Platform API is running.');
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    // Check if it's a specific database error (e.g., PostgreSQL unique constraint violation)
    if (err.code === '23505') {
        return res.status(409).json({ error: 'A record with this information already exists.' });
    }

    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error'
        }
    });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
