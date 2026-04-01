require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Bengaluru Neighborhoods Coordinates
const NEIGHBORHOODS = [
    { name: 'Koramangala', lat: 12.9343, lng: 77.6214 },
    { name: 'Indiranagar', lat: 12.9784, lng: 77.6408 },
    { name: 'Whitefield', lat: 12.9698, lng: 77.7499 },
    { name: 'Hebbal', lat: 13.0354, lng: 77.5988 }
];

// Dynamic images will be generated via LoremFlickr API in the loop
const getRandomNumber = (min, max) => Math.random() * (max - min) + min;

// Generate a lat/lng slightly offset from a center point
const generateRandomCoordinates = (centerLat, centerLng, maxOffset = 0.05) => {
    return {
        lat: centerLat + getRandomNumber(-maxOffset, maxOffset),
        lng: centerLng + getRandomNumber(-maxOffset, maxOffset)
    };
};

const seedDatabase = async () => {
    console.log("Starting database seeding for Bengaluru region...");

    try {
        // Add columns if they don't exist
        console.log("Checking schema alterations...");
        try {
            await pool.query('ALTER TABLE daycares ADD COLUMN image_url VARCHAR(1000)');
        } catch (e) { console.log('image_url column might already exist.'); }

        try {
            await pool.query('ALTER TABLE daycares ADD COLUMN review_count INTEGER DEFAULT 0');
        } catch (e) { console.log('review_count column might already exist.'); }

        // Clear existing data (optional, but good for starting fresh during dev)
        await pool.query('TRUNCATE daycares RESTART IDENTITY CASCADE');
        console.log("Existing daycare records cleared.");

        for (let i = 1; i <= 100; i++) {
            const neighborhood = NEIGHBORHOODS[Math.floor(Math.random() * NEIGHBORHOODS.length)];
            const coords = generateRandomCoordinates(neighborhood.lat, neighborhood.lng);

            const monthly_fee = Math.floor(getRandomNumber(8000, 30000));
            const registration_fee = Math.floor(getRandomNumber(1000, 5000));

            // Ensure ratings favor 3.5 to 5.0
            const overall_rating = Number(getRandomNumber(3.5, 5.0).toFixed(1));

            const total_seats = Math.floor(getRandomNumber(20, 100));
            const available_seats = Math.floor(getRandomNumber(0, total_seats * 0.4)); // 0 to 40% open

            const is_verified = Math.random() > 0.3; // 70% verified
            const review_count = Math.floor(getRandomNumber(5, 120));
            // Generate unique locked image using LoremFlickr with daycare keywords
            const image_url = `https://loremflickr.com/400/300/daycare,preschool,toddler?lock=${i}`;

            // Generate dynamic names based on the neighborhood
            const prefixes = ['Little Step', 'Bright Minds', 'Happy Kids', 'Sunshine', 'Blooming', 'Smart Sprouts', 'Wonder Years', 'Creative Care', 'Tiny Tots', 'Safe Haven'];
            const name = `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${neighborhood.name}`;

            // Insert into table with array literal formatting for Postgres
            await pool.query(
                `INSERT INTO daycares 
            (name, latitude, longitude, monthly_fee, registration_fee, total_seats, available_seats, age_groups_accepted, overall_rating, is_verified, image_url, review_count) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                [
                    name,
                    coords.lat,
                    coords.lng,
                    monthly_fee,
                    registration_fee,
                    total_seats,
                    available_seats,
                    '{0-2, 3-5}', // String format for postgres arrays to guarantee success
                    overall_rating,
                    is_verified,
                    image_url,
                    review_count
                ]
            );
        }

        console.log("Successfully seeded 100 daycare records!");

    } catch (err) {
        console.error("Error during seeding:", err);
    } finally {
        pool.end();
    }
};

seedDatabase();
