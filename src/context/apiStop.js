const apiStop = state => ({
  stop: () => {
    state._timeout = clearTimeout(state._timeout);
    return state;
  },
});

export default apiStop;
