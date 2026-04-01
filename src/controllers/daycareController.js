const db = require('../config/db');

/**
 * Min-Heap Implementation for Recommendation Engine
 * Maintains the top K highest-scoring daycares.
 * 
 * Space Complexity: O(K) where K is the number of recommended items (e.g., 5).
 * Time Complexity (Insert): O(log K)
 */
class MinHeap {
    constructor(capacity) {
        this.heap = [];
        this.capacity = capacity;
    }

    // Helper to get parent/child indices
    getLeftChildIndex(parentIndex) { return 2 * parentIndex + 1; }
    getRightChildIndex(parentIndex) { return 2 * parentIndex + 2; }
    getParentIndex(childIndex) { return Math.floor((childIndex - 1) / 2); }

    // Helper to check existence
    hasLeftChild(index) { return this.getLeftChildIndex(index) < this.heap.length; }
    hasRightChild(index) { return this.getRightChildIndex(index) < this.heap.length; }
    hasParent(index) { return this.getParentIndex(index) >= 0; }

    leftChild(index) { return this.heap[this.getLeftChildIndex(index)]; }
    rightChild(index) { return this.heap[this.getRightChildIndex(index)]; }
    parent(index) { return this.heap[this.getParentIndex(index)]; }

    swap(indexOne, indexTwo) {
        const temp = this.heap[indexOne];
        this.heap[indexOne] = this.heap[indexTwo];
        this.heap[indexTwo] = temp;
    }

    peek() {
        if (this.heap.length === 0) return null;
        return this.heap[0];
    }

    push(item) {
        if (this.heap.length < this.capacity) {
            this.heap.push(item);
            this.heapifyUp();
        } else if (item.score > this.peek().score) {
            // If the heap is full, and the new item's score is > the smallest score in heap
            this.heap[0] = item;
            this.heapifyDown();
        }
    }

    heapifyUp() {
        let index = this.heap.length - 1;
        while (this.hasParent(index) && this.parent(index).score > this.heap[index].score) {
            this.swap(this.getParentIndex(index), index);
            index = this.getParentIndex(index);
        }
    }

    heapifyDown() {
        let index = 0;
        while (this.hasLeftChild(index)) {
            let smallerChildIndex = this.getLeftChildIndex(index);
            if (this.hasRightChild(index) && this.rightChild(index).score < this.leftChild(index).score) {
                smallerChildIndex = this.getRightChildIndex(index);
            }

            if (this.heap[index].score < this.heap[smallerChildIndex].score) {
                break;
            } else {
                this.swap(index, smallerChildIndex);
            }
            index = smallerChildIndex;
        }
    }

    toArray() {
        // Return sorted descending
        return [...this.heap].sort((a, b) => b.score - a.score).map(item => item.daycare);
    }
}

/**
 * Controller to get daycares with filtering and sorting.
 * 
 * ALGORMITHMIC LOGIC:
 * 1. FILTERING:
 *    - We construct a SQL query dynamically based on the provided query parameters.
 *    - Time Complexity: O(N) where N is the total number of records in the database (if no index entires are found), 
 *      but practically O(log N) or O(K) where K is the number of matching records due to database indexing.
 *      The filtering logic itself in JS is O(1) as it just builds the query string.
 * 
 * 2. SORTING:
 *    - Sorting is done at the database level for 'lowest_fee' and 'highest_rated' for efficiency.
 *    - 'Best Match' is a custom heuristic that might be complex to express purely in SQL without a stored procedure or complex expression.
 *      However, for this implementation, we will implement 'Best Match' in JavaScript to demonstrate the algorithmic logic requested.
 *      FETCHING Strategies:
 *      - If sort is simple (fee/rating), we let SQL do `ORDER BY`.
 *      - If sort is 'best_match', we fetch the filtered results and sort in memory.
 * 
 * SPACE COMPLEXITY:
 * - O(K) where K is the number of returned records held in memory.
 */
exports.getDaycares = async (req, res) => {
    try {
        const {
            min_fee,
            max_fee,
            min_rating,
            is_verified,
            sort,
            userLat,
            userLng
        } = req.query;

        let queryText = 'SELECT * FROM daycares WHERE 1=1';
        let queryParams = [];
        let paramIndex = 1;

        // --- FILTERING ALGORITHM ---

        // 1. Budget Filter
        // Time Complexity: O(1) to append string
        if (min_fee) {
            queryText += ` AND monthly_fee >= $${paramIndex}`;
            queryParams.push(min_fee);
            paramIndex++;
        }
        if (max_fee) {
            queryText += ` AND monthly_fee <= $${paramIndex}`;
            queryParams.push(max_fee);
            paramIndex++;
        }

        // 2. Capacity Filter
        // Check if available_seats is > 0
        queryText += ` AND available_seats > 0`;

        // 3. Quality Filter
        if (min_rating) {
            queryText += ` AND overall_rating >= $${paramIndex}`;
            queryParams.push(min_rating);
            paramIndex++;
        }
        if (is_verified === 'true') {
            queryText += ` AND is_verified = TRUE`;
        }

        // --- SORTING ALGORITHM ---

        // We can handle simple sorts in SQL
        if (sort === 'lowest_fee') {
            // Sorting by sum of monthly_fee and registration_fee
            queryText += ` ORDER BY (monthly_fee + registration_fee) ASC`;
        } else if (sort === 'highest_rated') {
            queryText += ` ORDER BY overall_rating DESC`;
        }

        // Execute Query
        const { rows } = await db.query(queryText, queryParams);
        let daycares = rows;

        // --- CUSTOM "BEST MATCH" SORTING ALGORITHM (In-Memory) ---
        /*
         * Logic: Calculate a relevance score.
         * Score = (Rating * W1) - (Normalized Fee * W2)
         * We want high rating and low fee.
         * 
         * Time Complexity of Sort: O(K log K) where K is the number of filtered records.
         * JavaScript's V8 engine uses Timsort (adaptive merge sort), which is efficient.
         */
        if (sort === 'best_match') {
            const maxFeeInSet = daycares.reduce((max, d) => Math.max(max, Number(d.monthly_fee)), 1) || 1;

            // Haversine distance helper
            const getDistance = (lat1, lon1, lat2, lon2) => {
                if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
                const R = 6371; // km
                const dLat = (lat2 - lat1) * (Math.PI / 180);
                const dLon = (lon2 - lon1) * (Math.PI / 180);
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
                return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            };

            // Find max distance to normalize
            let maxDistanceInSet = 1;
            if (userLat && userLng) {
                maxDistanceInSet = daycares.reduce((max, d) => Math.max(max, getDistance(userLat, userLng, d.latitude, d.longitude)), 1) || 1;
            }

            daycares.sort((a, b) => {
                let RATING_WEIGHT = 0.5;
                let FEE_WEIGHT = 0.3;
                let DIST_WEIGHT = 0.2;

                if (!userLat || !userLng) {
                    RATING_WEIGHT = 0.7;
                    FEE_WEIGHT = 0.3;
                    DIST_WEIGHT = 0;
                }

                const distA = getDistance(userLat, userLng, a.latitude, a.longitude);
                const distB = getDistance(userLat, userLng, b.latitude, b.longitude);

                // Lower fee is better, Higher rating is better, Lower distance is better
                const scoreA =
                    (Number(a.overall_rating) / 5) * RATING_WEIGHT -
                    (Number(a.monthly_fee) / maxFeeInSet) * FEE_WEIGHT -
                    (distA / maxDistanceInSet) * DIST_WEIGHT;

                const scoreB =
                    (Number(b.overall_rating) / 5) * RATING_WEIGHT -
                    (Number(b.monthly_fee) / maxFeeInSet) * FEE_WEIGHT -
                    (distB / maxDistanceInSet) * DIST_WEIGHT;

                return scoreB - scoreA;
            });
        }

        res.json({
            count: daycares.length,
            data: daycares
        });

    } catch (err) {
        console.error(err.message);
        // We will pass errors to next() once we update the signature, but for now we keep existing behavior
        // Or better yet, we can pass it to the new global error handler by calling next(err)
        // Let's assume we'll update the parameters to include 'next'
        res.status(500).send('Server Error');
    }
};

/**
 * Advanced Recommendation Engine using Min-Heap
 * Time Complexity: O(N log K) where N = total daycares, K = 5
 * Space Complexity: O(K) for the Min-Heap
 */
exports.getRecommendedDaycares = async (req, res, next) => {
    try {
        // 1. Fetch all daycares (In a huge DB, we'd filter first, but we fetch all to score them)
        const { rows: daycares } = await db.query('SELECT * FROM daycares WHERE available_seats > 0');

        if (daycares.length === 0) {
            return res.json([]);
        }

        // 2. Normalize values for the scoring function
        const maxFee = daycares.reduce((max, d) => Math.max(max, Number(d.monthly_fee)), 1) || 1;
        const maxSeats = daycares.reduce((max, d) => Math.max(max, Number(d.available_seats)), 1) || 1;

        // Weights
        const W_RATING = 0.5;
        const W_PRICE = 0.3;
        const W_SEATS = 0.2;

        // 3. Initialize Min-Heap with Capacity K = 5
        const topKHeap = new MinHeap(5);

        // 4. Calculate score and push to Min-Heap
        for (const daycare of daycares) {
            const normalizedRating = Number(daycare.overall_rating) / 5.0;     // 0 to 1
            const normalizedPrice = Number(daycare.monthly_fee) / maxFee;        // 0 to 1
            const normalizedSeats = Number(daycare.available_seats) / maxSeats;  // 0 to 1

            // Score Logic: High Rating is good, Low Price is good, High Seats is good
            // So we subtract the normalized price penalty.
            const score = (normalizedRating * W_RATING)
                - (normalizedPrice * W_PRICE)
                + (normalizedSeats * W_SEATS);

            topKHeap.push({ score, daycare });
        }

        // 5. Extract top 5 from heap
        const recommended = topKHeap.toArray();

        res.json(recommended);
    } catch (err) {
        next(err);
    }
};

/**
 * Controller to get a single daycare by ID.
 * Phase 15: Now performs a secondary query to fetch associated Relational Reviews.
 */
exports.getDaycareById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM daycares WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Daycare not found' });
        }

        const daycare = result.rows[0];

        // Phase 15: Fetch associated reviews
        const reviewsResult = await db.query('SELECT id, parent_name, rating, comment, created_at FROM reviews WHERE daycare_id = $1 ORDER BY created_at DESC', [id]);

        // Attach reviews array to daycare payload
        daycare.reviews = reviewsResult.rows;

        res.json(daycare);
    } catch (err) {
        next(err);
    }
};

/**
 * Controller to create a new daycare.
 */
exports.createDaycare = async (req, res, next) => {
    try {
        const {
            name, latitude, longitude, monthly_fee, registration_fee,
            total_seats, available_seats, age_groups_accepted,
            overall_rating, is_verified
        } = req.body;

        const result = await db.query(
            `INSERT INTO daycares 
            (name, latitude, longitude, monthly_fee, registration_fee, total_seats, available_seats, age_groups_accepted, overall_rating, is_verified) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [name, latitude, longitude, monthly_fee, registration_fee, total_seats, available_seats, age_groups_accepted, overall_rating, is_verified]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

/**
 * Controller to update an existing daycare.
 */
exports.updateDaycare = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            name, latitude, longitude, monthly_fee, registration_fee,
            total_seats, available_seats, age_groups_accepted,
            overall_rating, is_verified
        } = req.body;

        const result = await db.query(
            `UPDATE daycares SET 
             name = COALESCE($1, name), 
             latitude = COALESCE($2, latitude), 
             longitude = COALESCE($3, longitude), 
             monthly_fee = COALESCE($4, monthly_fee), 
             registration_fee = COALESCE($5, registration_fee), 
             total_seats = COALESCE($6, total_seats), 
             available_seats = COALESCE($7, available_seats), 
             age_groups_accepted = COALESCE($8, age_groups_accepted), 
             overall_rating = COALESCE($9, overall_rating), 
             is_verified = COALESCE($10, is_verified),
             updated_at = CURRENT_TIMESTAMP
             WHERE id = $11 RETURNING *`,
            [name, latitude, longitude, monthly_fee, registration_fee, total_seats, available_seats, age_groups_accepted, overall_rating, is_verified, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Daycare not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

/**
 * Controller to delete a daycare.
 */
exports.deleteDaycare = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM daycares WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Daycare not found' });
        }

        res.json({ message: 'Daycare deleted successfully', deletedDaycare: result.rows[0] });
    } catch (err) {
        next(err);
    }
};
