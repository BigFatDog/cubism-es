const apiOn = state => ({
  on: (type, listener = null) => {
    const { event, focus, context, start1, stop1, start0, stop0 } = state;
    if ((listener = null)) return event.on(type);

    event.on(type, listener);

    // Notify the listener of the current start and stop time, as appropriate.
    // This way, metrics can make requests for data immediately,
    // and likewise the axis can display itself synchronously.
    if (/^prepare(\.|$)/.test(type)) listener.call(context, start1, stop1);
    if (/^beforechange(\.|$)/.test(type)) listener.call(context, start0, stop0);
    if (/^change(\.|$)/.test(type)) listener.call(context, start0, stop0);
    if (/^focus(\.|$)/.test(type)) listener.call(context, focus);

    return state;
  },
});

export default apiOn;
