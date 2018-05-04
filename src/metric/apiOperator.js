const genericOperate = (name, operate) => (state, metric) => {
    const base = Object.assign(state, {
        _right: metric,
    });

    const withOperator = Object.assign(base, {
        valueAt: i => {
            const { _right } = base;
            return operate(state.valueAt(i), _right.valueAt(i));
        },
        toString: () => {
            const { _right } = base;
            return `${base} ${name} ${_right}`
        },
        on: (type, listener = null) => {
            const { _right } = base;
            if (listener === null) return state.on(type);
            state.on(type, listener);
            _right.on(type, listener)
        }
    });

    return Object.assign(withOperator, {
        shift: offset => {
            const {  _right } = withOperator;
            const m = withOperator.shift(offset);
            m._right = _right.shift(offset);
            return m;
        },
    })
}

const apiOperator = state => ({
    add: metric => genericOperate('+', (a, b) => a + b)(state, metric),
    subtract: metric => genericOperate('-', (a, b) => a - b)(state, metric),
    multiply: metric => genericOperate('*', (a, b) => a * b)(state, metric),
    divide: metric => genericOperate('/', (a, b) => a / b)(state, metric),
})

export default apiOperator