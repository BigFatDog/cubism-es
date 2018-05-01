const apiStop = state => ({
  stop: () => {
    state.timeout = clearTimeout(state.timeout);
    return state.timeout;
  },
});

export default apiStop;
