// Number of metric to refetch each period, in case of lag.
const MetricOverlap = 6;

// Prefetch new data into a temporary array.
const apiPrepare = (state, request) => ({
  prepare: (start1, stop) => {
    const { size, start, step, fetching, event } = state;

    const steps = Math.min(size, Math.round((start1 - start) / step));
    if (!steps || fetching === true) return; // already fetched, or fetching!
    state.fetching = true;
    state.steps = Math.min(size, steps + MetricOverlap);
    const start0 = new Date(stop - steps * step);

    request(start0, stop, step, function(error, data) {
      state.fetching = false;
      if (error) return console.warn(error);
      const i = isFinite(start) ? Math.round((start0 - start) / step) : 0;
      for (let j = 0, m = data.length; j < m; ++j) values[j + i] = data[j];
      event.change.call(state, start, stop);
    });
  },
});

export default apiPrepare;
