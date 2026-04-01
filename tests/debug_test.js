const path = require('path');

console.log('--- Debugging Mock Injection ---');

// 1. Resolve path to db.js
const dbPath = require.resolve('../src/config/db');
console.log('Resolved dbPath:', dbPath);

// 2. Define Mock
const mockDb = {
    query: async (text, params) => {
        console.log('!!! MOCK DB CALLED !!!');
        return { rows: [] };
    }
};

// 3. Poison Cache
require.cache[dbPath] = {
    id: dbPath,
    filename: dbPath,
    loaded: true,
    exports: mockDb
};

// 4. Require Controller
try {
    const controller = require('../src/controllers/daycareController');
    console.log('Controller loaded.');

    // 5. Trigger function
    // We just want to see if it calls our mock
    // We pass a dummy req/res to trigger the query
    const req = { query: {} };
    const res = {
        json: () => console.log('res.json called'),
        status: () => ({ send: () => console.log('res.send called') })
    };

    controller.getDaycares(req, res);

} catch (error) {
    console.error('Error requiring controller:', error);
}
