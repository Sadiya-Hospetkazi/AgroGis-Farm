const express = require('express');
const router = express.Router();
const { logAction, getFarmerActions } = require('../controllers/actionController');

// Log a farming action
router.post('/log', logAction);

// Get actions for a farmer
router.get('/:farmerId', getFarmerActions);

module.exports = router;