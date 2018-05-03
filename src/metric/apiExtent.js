const apiExtent = state => ({
  extent: () => {
    const { _size, _values } = state;
    let i = 0,
      value,
      min = Infinity,
      max = -Infinity;
    while (++i < _size) {
      value = _values[i];
      if (value < min) min = value;
      if (value > max) max = value;
    }
    return [min, max];
  },
});

export default apiExtent;
