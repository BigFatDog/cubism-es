const apiStart = state => ({
  start: () => {
    const {
      timeout,
      start1,
      stop1,
      serverDelay,
      clientDelay,
      step,
      event,
      scale,
      size,
      stop0,
      start0,
    } = state;

    if (timeout) clearTimeout(timeout);
    let delay = +stop1 + serverDelay - Date.now();

    // If we're too late for the first prepare event, skip it.
    if (delay < clientDelay) delay += step;

    const prepare = () => {
      state.stop1 = new Date(
        Math.floor((Date.now() - serverDelay) / step) * step
      );
      state.start1 = new Date(stop1 - size * step);
      event.prepare.call(context, start1, stop1);

      setTimeout(function() {
        scale.domain([(state.start0 = start1), (state.stop0 = stop1)]);
        event.beforechange.call(context, start1, stop1);
        event.change.call(context, start1, stop1);
        event.focus.call(context, focus);
      }, clientDelay);

      state.timeout = setTimeout(prepare, step);
    };

    state.timeout = setTimeout(prepare, delay);

    return state;
  },
});

export default apiStart;
