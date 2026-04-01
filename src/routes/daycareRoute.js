const express = require('express');
const router = express.Router();
const daycareController = require('../controllers/daycareController');

// GET /daycares?min_fee=...&max_fee=...&sort=...
router.get('/', daycareController.getDaycares);

// GET /daycares/recommended (MUST be before /:id)
router.get('/recommended', daycareController.getRecommendedDaycares);

// GET /daycares/:id
router.get('/:id', daycareController.getDaycareById);

// POST /daycares
router.post('/', daycareController.createDaycare);

// PUT /daycares/:id
router.put('/:id', daycareController.updateDaycare);

// DELETE /daycares/:id
router.delete('/:id', daycareController.deleteDaycare);

module.exports = router;
