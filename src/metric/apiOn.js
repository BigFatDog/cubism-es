// When the context changes, switch to the new data, ready-or-not!
const beforechange = state => (start1, stop1) => {
  const { values, step, size, start } = state;
  if (!isFinite(state.start)) state.start = start1;
  values.splice(
    0,
    Math.max(0, Math.min(size, Math.round((start1 - start) / step)))
  );
  state.start = start1;
  state.stop = stop1;
};


// Prefetch new data into a temporary array.
const prepare = state => (start1, stop)=> {
    const { start, step, fetching, event, size } = state;
    const steps = Math.min(size, Math.round((start1 - start) / step));
    if (!steps || fetching) return; // already fetched, or fetching!
    state.fetching = true;
    state.steps = Math.min(size, steps + 6);
    const start0 = new Date(stop - state.steps * step);
    request(start0, stop, step, function(error, data) {
        state.fetching = false;
        if (error) return console.warn(error);
        const i = isFinite(start) ? Math.round((start0 - start) / step) : 0;
        for (let j = 0, m = data.length; j < m; ++j) values[j + i] = data[j];
        event.call('change', metric, start, stop);
    });
}

const apiOn = state => ({
  on: (type, listener = null) => {
    const { event, id, context, start, stop } = state;

    if (listener === null) return event.on(type);

    // If there are no listeners, then stop listening to the context,
    // and avoid unnecessary fetches.
    if (listener == null) {
      if (event.on(type) != null && --state.listening === 0) {
        context.on('prepare' + id, null).on('beforechange' + id, null);
      }
    } else {
      if (event.on(type) == null && ++state.listening === 1) {
        context
          .on('prepare' + id, prepare)
          .on('beforechange' + id, beforechange(state));
      }
    }

    event.on(type, listener);

    // Notify the listener of the current start and stop time, as appropriate.
    // This way, charts can display synchronous metrics immediately.
    if (listener != null) {
      if (/^change(\.|$)/.test(type)) listener.call(context, start, stop);
    }

    return state;
  },
});

export default apiOn;
