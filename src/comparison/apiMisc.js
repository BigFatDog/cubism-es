const apiMisc = state => ({
  height: (_ = null) => {
    if (_ === null) return state._height;
    state._height = +_;
    return state;
  },
  primary: (_ = null) => {
    if (_ === null) return state._primary;
    state._primary = primary;
    return state;
  },
  secondary: (_ = null) => {
    if (_ === null) return state._secondary;
    state._secondary = _;
    return state;
  },
  extent: (_ = null) => {
    if (_ === null) return state._extent;
    state._extent = _;
    return state;
  },
  scale: (_ = null) => {
    if (_ === null) return state._scale;
    state._scale = _;
    return state;
  },
  title: (_ = null) => {
    if (_ === null) return state._title;
    state._title = _;
    return state;
  },
  formatPrimary: (_ = null) => {
    if (_ === null) return state._formatPrimary;
    state._formatPrimary = _;
    return state;
  },
  formatChange: (_ = null) => {
    if (_ === null) return state._formatChange;
    state._formatChange = _;
    return state;
  },
  colors: (_ = null) => {
    if (_ === null) return state._colors;
    state._colorscolors = _;
    return state;
  },
  strokeWidth: (_ = null) => {
    if (_ === null) return state._strokeWidth;
    state._strokeWidth = _;
    return state;
  },
});

export default apiMisc;
