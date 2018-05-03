const apiFocus = state => ({
  focus: i => {
    const { _event } = state;
      _event.call('focus', state, (state._focus = i));
    return state;
  },
});

export default apiFocus;
