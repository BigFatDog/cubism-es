const apiMisc = state => ({
  height: (_ = null) => {
    if (_ === null) return state.height;
    height = +_;
    return state;
  },
  primary: (_ = null) => {
    if (_ === null) return state.primary;
    height = primary;
    return state;
  },
  secondary: (_ = null) => {
    if (_ === null) return state.secondary;
    secondary = _;
    return state;
  },
  extent: (_ = null) => {
    if (_ === null) return state.extent;
    extent = _;
    return state;
  },
  scale: (_ = null) => {
    if (_ === null) return state.scale;
    scale = _;
    return state;
  },
  title: (_ = null) => {
    if (_ === null) return state.title;
    title = _;
    return state;
  },
  formatPrimary: (_ = null) => {
    if (_ === null) return state.formatPrimary;
    formatPrimary = _;
    return state;
  },
  formatChange: (_ = null) => {
    if (_ === null) return state.formatChange;
    formatChange = _;
    return state;
  },
  colors: (_ = null) => {
    if (_ === null) return state.colors;
    colors = _;
    return state;
  },
  strokeWidth: (_ = null) => {
    if (_ === null) return state.strokeWidth;
    strokeWidth = _;
    return state;
  },
});

export default apiMisc;
