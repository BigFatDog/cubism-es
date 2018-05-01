const apiFocus = state => ({
  focus: i => {
    const { event } = state;
    event.call('focus', state, (state.focus = i));
    return state;
  },
});

export default apiFocus;
