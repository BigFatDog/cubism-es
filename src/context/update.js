const update = state => {
  const { stop0, step, serverDelay, clientDelay, scale } = state;
  const now = Date.now();
  state.stop0 = new Date(
    Math.floor((now - serverDelay - clientDelay) / step) * step
  );
  state.start0 = new Date(stop0 - size * step);
  state.stop1 = new Date(Math.floor((now - serverDelay) / step) * step);
  state.start1 = new Date(stop1 - size * step);
  scale.domain([start0, stop0]);
  return state;
};

export default update;
