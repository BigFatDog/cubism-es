const apiAlias = (state) => ({
  alias: (name) => {
    state.toString = () => name;
    return state;
  },
});

export default apiAlias;
