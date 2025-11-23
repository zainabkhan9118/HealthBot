const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getProgressData } = require('../controllers/progress');

router.get('/', protect, getProgressData);

module.exports = router;
