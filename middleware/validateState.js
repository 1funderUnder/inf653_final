const State = require('../model/State');
const statesData = require('../model/states.json');

const validateState = async (req, res, next, code) => {
  try {
    const upperCs = code.toUpperCase();

    // Validate from JSON,
    const stateJson = statesData.find(state => state.code === upperCs);
    if (!stateJson) {
      return res.status(404).json({ message: `Invalid state abbreviation parameter` });
    }

    // Attach funfacts from DB
    const stateDoc = await State.findOne({ stateCode: upperCs }).exec();
    req.state = stateDoc || null;
    req.stateCode = upperCs;

    next();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = validateState;

  