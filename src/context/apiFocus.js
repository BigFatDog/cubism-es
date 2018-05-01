const apiFocus = state => ({
  focus: i => {
    const { event } = state;
    event.focus.call(state, (state.focus = i));
    return state;
  },
});

export default apiFocus;
