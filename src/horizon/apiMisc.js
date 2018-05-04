const apiMisc = state => ({
    mode: (_ = null) => {
        if (_ === null) return state._mode;
        state._mode = _ + '';
        return state;
    },

    height: (_ = null) => {
        if (_ === null) return state._height;
        state._height = +_;
        return state;
    },

    metric: (_ = null) => {
        if (_ === null) return state._metric;
        state._metric = +_;
        return state;
    },

    scale: (_ = null) => {
        if (_ === null) return state._scale;
        state._scale = +_;
        return state;
    },

    extent: (_ = null) => {
        if (_ === null) return state._extent;
        state._extent = +_;
        return state;
    },

    title: (_ = null) => {
        if (_ === null) return state._title;
        state._title = +_;
        return state;
    },

    format: (_ = null) => {
        if (_ === null) return state._format;
        state._format = +_;
        return state;
    },
    colors: (_ = null) => {
        if (_ === null) return state._colors;
        state._colors = +_;
        return state;
    },
});

export default apiMisc