// When the context changes, switch to the new data, ready-or-not!
const beforechange = state => (start1, stop1) => {
  const {_step, _size } = state;
  if (!isFinite(state._start)) state._start = start1;
  state._values.splice(
    0,
    Math.max(0, Math.min(_size, Math.round((start1 - state._start) / _step)))
  );
  state._start = start1;
  state._stop = stop1;
};

// Prefetch new data into a temporary array.
const prepare = (state, request) => (start1, stop) => {
  const { _start, _step, _fetching, _event, _size } = state;
  const steps = Math.min(_size, Math.round((start1 - _start) / _step));
  if (!steps || _fetching) return; // already fetched, or fetching!
  state._fetching = true;
  state._steps = Math.min(_size, steps + 6);
  const start0 = new Date(stop - state._steps * _step);
  request(start0, stop, _step, function(error, data) {
    state.fetching = false;
    if (error) return console.warn(error);
    const i = isFinite(_start) ? Math.round((start0 - _start) / _step) : 0;
    for (let j = 0, m = data.length; j < m; ++j) state._values[j + i] = data[j];
    _event.call('change', _start, stop);
  });
};

const apiOn = (state, request) => ({
  on: (type, listener = null) => {
    const { _event, _id, context, _start, _stop } = state;

    if (listener === null) return _event.on(type);

    // If there are no listeners, then stop listening to the context,
    // and avoid unnecessary fetches.
    if (listener == null) {
      if (_event.on(type) != null && --state._listening === 0) {
        context.on('prepare' + _id, null).on('beforechange' + _id, null);
      }
    } else {
      if (_event.on(type) == null && ++state._listening === 1) {
        context
          .on('prepare' + _id, prepare(state, request))
          .on('beforechange' + _id, beforechange(state));
      }
    }

    _event.on(type, listener);

    // Notify the listener of the current start and stop time, as appropriate.
    // This way, charts can display synchronous metrics immediately.
    if (listener != null) {
      if (/^change(\.|$)/.test(type)) listener(_start, _stop);
    }

    return state;
  },
});

export default apiOn;
