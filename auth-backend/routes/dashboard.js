const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getDashboardOverview, getResourceRecommendations } = require('../controllers/dashboard');

router.get('/overview', protect, getDashboardOverview);
router.get('/resources', protect, getResourceRecommendations);

module.exports = router;

