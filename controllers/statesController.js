const State = require('../model/State');
const statesData = require('../model/states.json');

// Find JSON state
const findStateData = (code) => {
  return statesData.find(state => state.code === code.toUpperCase());
};

// GET /states
const getAllStates = async (req, res) => {
  const contigParam = req.query.contig;
  let filteredStates = [...statesData];

  // Query for contig states
  if (contigParam === 'true') {
    filteredStates = filteredStates.filter(
      state => state.code !== 'AK' && state.code !== 'HI'
    );
  } else if (contigParam === 'false') {
    filteredStates = filteredStates.filter(
      state => state.code === 'AK' || state.code === 'HI'
    );
  }

  try {
    const funfactDocs = await State.find();
    const mergedStates = filteredStates.map(state => {
      const match = funfactDocs.find(doc => doc.stateCode === state.code);
      return {
        ...state,
        funfacts: match?.funfacts || []
      };
    });

    res.json(mergedStates);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /states/:stateCode
const getState = async (req, res) => {
  const code = req.stateCode;
  const stateJson = findStateData(code);
  if (!stateJson) {
    return res.status(404).json({ message: 'State not found' });
  }

  try {
    const stateDoc = await State.findOne({ stateCode: code }).exec();
    const funfacts = stateDoc?.funfacts || [];
    res.json({ ...stateJson, funfacts });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET/states/:stateCode/funfact
const getFunfacts = async (req, res) => {
  const code = req.params.stateCode.toUpperCase();

  const stateJson = statesData.find(state => state.code === code);
  if (!stateJson) {
    return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
  }

  try {
    const stateDoc = await State.findOne({ stateCode: code }).exec();

    if (!stateDoc || !stateDoc.funfacts || stateDoc.funfacts.length === 0) {
      return res.status(404).json({ message: `No Fun Facts found for ${stateJson.state}` });
    }

    res.json({ funfacts: stateDoc.funfacts });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST/states/:stateCode/funfact
const addFunfacts = async (req, res) => {
  const code = req.params.stateCode.toUpperCase();
  const { funfacts } = req.body;

  if (!Array.isArray(funfacts)) {
    return res.status(400).json({ message: 'funfacts must be an array' });
  }

  try {
    let state = await State.findOne({ stateCode: code });

    if (!state) {
      state = new State({ stateCode: code, funfacts });
    } else {
      state.funfacts.push(...funfacts);
    }

    await state.save();
    res.json(state);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE funfact by index
const deleteFunfact = async (req, res) => {
  const code = req.params.stateCode.toUpperCase();
  const { index } = req.body;

  // Check that index is a positive integer
  if (!Number.isInteger(index) || index < 1) {
    return res.status(400).json({ message: 'Index must be a positive integer (1-based)' });
  }

  try {
    const state = await State.findOne({ stateCode: code });

    if (!state || !state.funfacts || state.funfacts.length === 0) {
      return res.status(404).json({ message: `No fun facts found for ${code}` });
    }

    const arrayIndex = index - 1;

    if (arrayIndex >= state.funfacts.length) {
      return res.status(404).json({ message: `No Fun Fact found at index ${index} for ${code}` });
    }

    state.funfacts.splice(arrayIndex, 1);
    await state.save();
    res.json(state);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllStates,
  getState,
  getFunfacts,
  addFunfacts,
  deleteFunfact
};
