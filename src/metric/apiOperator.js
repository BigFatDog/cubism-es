const genericOperate = (name, operate) => (state, metric) => {
  return Object.assign(
    {},
    state,
    {
      valueAt: i => operate(state.valueAt(i), metric.valueAt(i)),
      toString: () => `${state} ${name} ${metric}`,
      on: (type, listener = null) => {
        if (listener === null) return state.on(type);
        state.on(type, listener);
        metric.on(type, listener);
      },
    },
    {
      shift: offset =>
        genericOperate(name, operate)(
          state.shift(offset),
          metric.shift(offset)
        ),
    }
  );
};

const apiOperator = state => ({
  add: metric => genericOperate('+', (a, b) => a + b)(state, metric),
  subtract: metric => genericOperate('-', (a, b) => a - b)(state, metric),
  multiply: metric => genericOperate('*', (a, b) => a * b)(state, metric),
  divide: metric => genericOperate('/', (a, b) => a / b)(state, metric),
});

export default apiOperator;
