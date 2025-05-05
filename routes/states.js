const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');
const validateState = require('../middleware/validateState');

// Middleware for stateCode param
router.param('stateCode', validateState);

// GET capital
router.get('/:stateCode/capital', statesController.getStateCapital);

// GET nickname
router.get('/:stateCode/nickname', statesController.getStateNickname);

// GET population
router.get('/:stateCode/population', statesController.getStatePopulation);

// Get admission
router.get('/:stateCode/admission', statesController.getStateAdmission);

// GET funfacts
router.get('/:stateCode/funfact', statesController.getFunfacts);

// POST funfacts
router.post('/:stateCode/funfact', statesController.addFunfacts);

// PATCH funfacts
router.patch('/:stateCode/funfact', statesController.patchFunfact);

// DELETE funfact
router.delete('/:stateCode/funfact', statesController.deleteFunfact);

// GET one state
router.get('/:stateCode', statesController.getState);

// GET all states
router.get('/', statesController.getAllStates);

module.exports = router;

