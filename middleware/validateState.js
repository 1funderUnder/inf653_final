const State = require('../model/State');
const statesData = require('../model/states.json');

const validateState = async (req, res, next, code) => {
  try {
    const upperCs = code.toUpperCase();

    // Validate from JSON,
    const stateJson = statesData.find(state => state.code === upperCs);
    if (!stateJson) {
      const err = new Error('Invalid state abbreviation parameter');
      err.status = 404;
      return next(err);
    }

    // Attach funfacts from DB
    const stateDoc = await State.findOne({ stateCode: upperCs }).exec();
    req.stateJson = stateJson;
    req.state = stateDoc || null;
    req.stateCode = upperCs;

    // console.log('Validated stateCode:', upperCs); // To debug

    next();
  } catch (err) {
    next(err); // Pass the error to the centralized error handler
  }
};

module.exports = validateState;

  