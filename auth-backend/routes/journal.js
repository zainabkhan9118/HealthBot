const express = require('express');
const router = express.Router();
const { getJournalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry } = require('../controllers/journal');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getJournalEntries)
  .post(addJournalEntry);

router.route('/:id')
  .put(updateJournalEntry)
  .delete(deleteJournalEntry);

module.exports = router;
