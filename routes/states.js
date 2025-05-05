const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');
const validateState = require('../middleware/validateState');

// Middleware for stateCode param
router.param('stateCode', validateState);

// GET all states
router.get('/', statesController.getAllStates);

// GET one state
router.get('/:stateCode', statesController.getState);

// GET funfacts
router.get('/:stateCode/funfact', statesController.getFunfacts);

// POST funfacts
router.post('/:stateCode/funfact', statesController.addFunfacts);

// DELETE funfact
router.delete('/:stateCode/funfact', statesController.deleteFunfact);

module.exports = router;

