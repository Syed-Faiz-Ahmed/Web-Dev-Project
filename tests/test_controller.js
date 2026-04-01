// Delayed require of controller after mocking db
// const daycareController = require('../src/controllers/daycareController');

// Mock DB
const mockData = [
    { id: 1, name: 'Daycare A', monthly_fee: 1000, overall_rating: 4.5, available_seats: 5, is_verified: true, registration_fee: 100 },
    { id: 2, name: 'Daycare B', monthly_fee: 2000, overall_rating: 4.8, available_seats: 2, is_verified: true, registration_fee: 200 },
    { id: 3, name: 'Daycare C', monthly_fee: 500, overall_rating: 3.5, available_seats: 10, is_verified: false, registration_fee: 50 },
    { id: 4, name: 'Daycare D', monthly_fee: 1200, overall_rating: 4.9, available_seats: 0, is_verified: true, registration_fee: 150 }, // Full
];

const mockDb = {
    query: async (text, params) => {
        console.log('Executing Query:', text);
        console.log('Params:', params);

        // Simple mock filtering based on params if needed, but for now just returning data 
        // to test the JS-side logic (Best Match sort) or assuming the query worked.
        // For accurate testing, we should filter mockData based on query text construction.

        let filtered = mockData.filter(d => {
            // Simulate SQL WHERE clauses roughly
            if (text.includes('available_seats > 0') && d.available_seats === 0) return false;
            // ... add more if needed
            return true;
        });

        return { rows: filtered };
    }
};

// Mock Require keys to swap db with mockDb
// Since we can't easily proxy require in this simple script without extensive setup, 
// we'll just manually inject or trust the heavy lifting is in the SQL construction which we see logged.
// Wait, the controller requires '../config/db'. I can't easily mock that without proxyquire or similar.
// I will modify the controller temporarily OR just write a unit test that imports the function
// but I can't inject the db dependency since it's hardcoded.
// Actually, I can use proxyquire if I install it, or I can just modify the controller to accept db as dependency (dependency injection).
// BUT modifying code just for tests isn't always ideal.
// ALTERNATIVE: I will create a wrapper script that uses `proxyquire` equivalent or just `mock-require`.
// OR EASIER: I will overwrite `require.cache` for the db module before requiring the controller.

const dbPath = require.resolve('../src/config/db');
require.cache[dbPath] = {
    id: dbPath,
    filename: dbPath,
    loaded: true,
    exports: mockDb
};

// Now require controller (it will use cached mockDb)
const controllerNow = require('../src/controllers/daycareController');

const req = {
    query: {
        sort: 'best_match' // Test the JS sorting
    }
};

const res = {
    json: (data) => {
        console.log('Response JSON:', JSON.stringify(data, null, 2));
    },
    status: (code) => ({ send: (msg) => console.log('Error:', code, msg) })
};

console.log('--- Testing Best Match Sort ---');
controllerNow.getDaycares(req, res);
