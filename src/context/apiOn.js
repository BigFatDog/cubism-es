const apiOn = (state) => ({
  on: (type, listener = null) => {
    const { _event, _focus, _start1, _stop1, _start0, _stop0 } = state;
    if (listener === null) return _event.on(type);

    _event.on(type, listener);

    // Notify the listener of the current start and stop time, as appropriate.
    // This way, metrics can make requests for data immediately,
    // and likewise the axis can display itself synchronously.
    if (/^prepare(\.|$)/.test(type)) listener(_start1, _stop1);
    if (/^beforechange(\.|$)/.test(type)) listener(_start0, _stop0);
    if (/^change(\.|$)/.test(type)) listener(_start0, _stop0);
    if (/^focus(\.|$)/.test(type)) listener(_focus);

    return state;
  },
});

export default apiOn;
