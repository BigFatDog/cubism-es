import update from './update';

// Set or ge2t the step interval in milliseconds.
// Defaults to ten seconds.
const apiStep = state => ({
  step: (_step = null) => {
    if (_step === null) return step;
    step = +_step;
    return update(state);
  },
});

export default apiStep;
