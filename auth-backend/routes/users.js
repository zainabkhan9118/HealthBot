const express = require('express');
const router = express.Router();
const { getAllUsers, getUser, updateUser, deleteUser } = require('../controllers/users');
const { changePassword } = require('../controllers/password');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getAllUsers);

router.route('/:id')
  .get(protect, getUser)
  .put(protect, updateUser)
  .delete(protect, deleteUser);

router.route('/:id/change-password')
  .put(protect, changePassword);

module.exports = router;
