import update from './update';

// Set or get the context size (the count of metric values).
// Defaults to 1440 (four hours at ten seconds).
const apiSize = (state) => ({
  size: (_size = null) => {
    if (_size === null) return state._size;
    state._scale.range([0, (state._size = +_size)]);
    return update(state);
  },
});

export default apiSize;
