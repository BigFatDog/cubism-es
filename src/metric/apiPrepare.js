// Number of metric to refetch each period, in case of lag.
const MetricOverlap = 6;

// Prefetch new data into a temporary array.
const apiPrepare = (state, request) => ({
  prepare: (start1, stop) => {
    const { _size, _start, _step, _fetching, _event } = state;

    const steps = Math.min(_size, Math.round((start1 - _start) / _step));
    if (!steps || _fetching === true) return; // already fetched, or fetching!
    state._fetching = true;
    state._steps = Math.min(_size, steps + MetricOverlap);
    const start0 = new Date(stop - steps * _step);

    request(start0, stop, _step, function(error, data) {
      state._fetching = false;
      if (error) return console.warn(error);
      const i = isFinite(_start) ? Math.round((start0 - _start) / _step) : 0;
      for (let j = 0, m = data.length; j < m; ++j) values[j + i] = data[j];
      _event.call('change', state, _start, stop);
    });
  },
});

export default apiPrepare;
