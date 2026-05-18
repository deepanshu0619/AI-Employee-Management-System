const express = require('express');
const router = express.Router();
const { getRecommendation } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

/**
 * AI Routes — Protected by JWT authentication
 *
 * POST /api/ai/recommend — Get AI-powered employee recommendations
 * Body: { employees: [...], type: "promotion"|"ranking"|"training"|"feedback" }
 */
router.post('/recommend', protect, getRecommendation);

module.exports = router;
