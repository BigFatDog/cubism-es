const apiExtent = state => ({
  extent: () => {
    const { context } = state;
    let i = 0,
      n = context.size(),
      value,
      min = Infinity,
      max = -Infinity;
    while (++i < n) {
      value = state.valueAt(i);
      if (value < min) min = value;
      if (value > max) max = value;
    }
    return [min, max];
  },
});

export default apiExtent;
