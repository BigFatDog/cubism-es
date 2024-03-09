// Wraps the specified request implementation, and shifts time by the given offset.
const metricShift = (request, offset) => (start, stop, step, callback) =>
  request(new Date(+start + offset), new Date(+stop + offset), step, callback);

const apiShift = (state, request) => ({
  shift: (offset) => {
    const { context } = state;

    return context.metric(metricShift(request, +offset));
  },
});

export default apiShift;
