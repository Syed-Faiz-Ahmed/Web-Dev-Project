const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'daycare_db',
    password: process.env.DB_PASSWORD || 'root', // fallback
    port: process.env.DB_PORT || 5432,
});

const generateMockReviews = (daycare) => {
    const templates = [
        `My child absolutely loves the teachers at ${daycare.name}!`,
        `Very safe and clean facility. Highly recommended in the ${daycare.location || 'area'}.`,
        `The curriculum at ${daycare.name} is fantastic. We've seen so much growth.`,
        `Great communication from the staff. We always know how our child's day went.`,
        `The outdoor play area is wonderful. Best decision we made for our family!`,
        `Affordable and high quality. We trust ${daycare.name} completely.`,
        `Our daughter comes home happy every single day.`,
        `They really care about early childhood development here.`,
        `A bit pricey but the value for money is absolutely there.`,
        `The meals provided are healthy and my son always eats them!`
    ];

    const generateRandomReview = () => {
        const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
        const rating = Math.floor(Math.random() * 3) + 3; // Random rating between 3 and 5
        const firstNames = ['Sarah', 'David', 'Emily', 'Michael', 'Jessica', 'James', 'Amanda', 'Robert', 'Ashley', 'William'];
        const lastInitials = ['M.', 'P.', 'R.', 'S.', 'T.', 'L.', 'K.', 'W.', 'B.', 'H.'];
        const parentName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastInitials[Math.floor(Math.random() * lastInitials.length)]}`;

        return {
            parent_name: parentName,
            rating: rating,
            comment: randomTemplate
        };
    };

    // Generate 3 to 5 reviews
    const numReviews = Math.floor(Math.random() * 3) + 3;
    const reviews = [];
    for (let i = 0; i < numReviews; i++) {
        reviews.push(generateRandomReview());
    }
    return reviews;
};

const seedReviews = async () => {
    try {
        console.log('Connecting to database...');
        const client = await pool.connect();

        console.log('Fetching daycares...');
        const { rows: daycares } = await client.query('SELECT id, name FROM daycares');

        console.log(`Found ${daycares.length} daycares. Seeding reviews...`);
        let totalReviewsInserted = 0;

        for (const daycare of daycares) {
            const reviews = generateMockReviews(daycare);

            for (const review of reviews) {
                await client.query(
                    `INSERT INTO reviews (daycare_id, parent_name, rating, comment) VALUES ($1, $2, $3, $4)`,
                    [daycare.id, review.parent_name, review.rating, review.comment]
                );
                totalReviewsInserted++;
            }
        }

        console.log(`Successfully inserted ${totalReviewsInserted} reviews across ${daycares.length} daycares.`);
        client.release();
        process.exit(0);

    } catch (err) {
        console.error('Error seeding reviews:', err);
        process.exit(1);
    }
};

seedReviews();
