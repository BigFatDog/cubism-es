const apiStart = (state) => ({
  start: () => {
    const {
      _timeout,
      _stop1,
      _serverDelay,
      _clientDelay,
      _step,
      _event,
      _scale,
      _size,
      _focus,
    } = state;

    if (_timeout) clearTimeout(_timeout);
    let delay = +_stop1 + _serverDelay - Date.now();

    // If we're too late for the first prepare _event, skip it.
    if (delay < _clientDelay) delay += _step;

    const prepare = () => {
      state._stop1 = new Date(
        Math.floor((Date.now() - _serverDelay) / _step) * _step
      );
      state._start1 = new Date(state._stop1 - _size * _step);
      _event.call('prepare', state, state._start1, state._stop1);

      setTimeout(() => {
        state.start0 = state._start1;
        state.stop0 = state._stop1;
        _scale.domain([state.start0, state.stop0]);
        _event.call('beforechange', state, state._start1, state._stop1);
        _event.call('change', state, state._start1, state._stop1);
        _event.call('focus', state, _focus);
      }, _clientDelay);

      state.timeout = setTimeout(prepare, _step);
    };

    state.timeout = setTimeout(prepare, delay);

    return state;
  },
});

export default apiStart;
