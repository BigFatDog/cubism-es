const update = state => {
    const {
        _step,
        _serverDelay,
        _clientDelay,
        _scale,
        _size,
    } = state;
    const now = Date.now();
    state._stop0 = new Date(
        Math.floor((now - _serverDelay - _clientDelay) / _step) * _step
    );
    state._start0 = new Date(state._stop0 - _size * _step);
    state._stop1 = new Date(Math.floor((now - _serverDelay) / _step) * _step);
    state._start1 = new Date(state._stop1 - _size * _step);
    _scale.domain([state._start0, state._stop0]);
    return state;
};

export default update;
