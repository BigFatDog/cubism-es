const apiRemove = (ruleState, selection) => ({
  remove: () => {
    const { context } = ruleState;

    selection
      .selectAll('.line')
      .each(d => context.on('focus.rule-' + d.id, null))
      .remove();
  },
});

const apiMetric = ruleState => ({
  metric: (metric = null) => {
    if (metric === null) return ruleState.metric;
    ruleState.metric = metric;
    return ruleState;
  },
});

const runRule = (state, selection) => {
  const { context, metric } = state;
  const id = ++context._id;

  const line = selection
    .append('div')
    .datum({ id: id })
    .attr('class', 'line')
    .style('position', 'absolute')
    .style('top', 0)
    .style('bottom', 0)
    .style('width', '1px')
    .style('pointer-events', 'none');

  selection.each((d, i) => {
    const metric_ = typeof metric === 'function' ? metric(d, i) : metric;

    if (!metric_) return;

    const change = (start, stop) => {
      const values = [];

      for (let i = 0, n = context.size(); i < n; ++i) {
        if (metric_.valueAt(i)) {
          values.push(i);
        }
      }

      const lines = selection.selectAll('.metric').data(values);
      lines.exit().remove();
      lines
        .enter()
        .append('div')
        .attr('class', 'metric line')
        .style('position', 'absolute')
        .style('top', 0)
        .style('bottom', 0)
        .style('width', '1px')
        .style('pointer-events', 'none');

      lines.style('left', i => i + 'px');
    };

    context.on('change.rule-' + id, change);
    metric_.on('change.rule-' + id, change);
  });

  context.on('focus.rule-' + id, i => {
    line
      // .datum(i)
      .style('display', i == null ? 'none' : null)
      .style('left', i == null ? null : `${i}px`);
  });
};

const apiRule = context => ({
  rule: selection => {
    const state = {
      context,
      metric: d => d,
    };

    runRule(state, selection);

    return Object.assign(state, apiRemove(state), apiMetric(state));
  },
});

export default apiRule;
