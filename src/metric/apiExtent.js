const apiExtent = state => ({
  extent: () => {
    const { size, values } = state;
    let i = 0,
      value,
      min = Infinity,
      max = -Infinity;
    while (++i < size) {
      value = values[i];
      if (value < min) min = value;
      if (value > max) max = value;
    }
    return [min, max];
  },
});

export default apiExtent;
