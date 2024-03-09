const apiRemove = (ruleState, selection) => ({
  remove: () => {
    const { _context } = ruleState;

    selection
      .selectAll('.line')
      .each((d) => _context.on('focus.rule-' + d.id, null))
      .remove();
  },
});

const apiMetric = (ruleState) => ({
  metric: (metric = null) => {
    if (metric === null) return ruleState._metric;
    ruleState._metric = metric;
    return ruleState;
  },
});

const apiRender = (state) => ({
  render: (selection) => {
    const { _context, _metric } = state;
    const id = ++_context._id;

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
      const metric_ = typeof _metric === 'function' ? _metric(d, i) : _metric;
      if (!metric_) return;

      const change = (start, stop) => {
        const values = [];

        for (let i = 0, n = _context.size(); i < n; ++i) {
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

        lines.style('left', (i) => i + 'px');
      };

      _context.on('change.rule-' + id, change);
      metric_.on('change.rule-' + id, change);
    });

    _context.on('focus.rule-' + id, (i) => {
      line
        // .datum(i)
        .style('display', i == null ? 'none' : null)
        .style('left', i == null ? null : `${i}px`);
    });
  },
});

const apiRule = (context) => ({
  rule: () => {
    const state = {
      _context: context,
      _metric: (d) => d,
    };

    return Object.assign(
      state,
      apiRemove(state),
      apiMetric(state),
      apiRender(state)
    );
  },
});

export default apiRule;
