const apiStop = state => ({
  stop: () => {
    state.timeout = clearTimeout(state.timeout);
    return state;
  },
});

export default apiStop;
