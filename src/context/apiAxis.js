import { timeFormat } from 'd3-time-format';
import { axisBottom, axisLeft, axisRight, axisTop } from 'd3-axis';
import { select } from 'd3-selection';

const formatSeconds = timeFormat('%I:%M:%S %p');
const formatMinutes = timeFormat('%I:%M %p');
const formatDays = timeFormat('%B %d');
const formatDefault = context =>
  context.step() < 6e4
    ? formatSeconds
    : context.step() < 864e5
      ? formatMinutes
      : formatDays;

const apiRemove = axisState => ({
  remove: selection => {
    const { context } = axisState;
    selection
      .selectAll('svg')
      .each(d => {
        context.on('change.axis-' + d.id, null);
        context.on('focus.axis-' + d.id, null);
      })
      .remove();
  },
});

const apiFocusFormat = axisState => ({
  focusFormat: (_ = null) => {
    if (_ === null)
      return axisState.format === formatDefault(axisState.context) ? null : _;
    axisState.format = _ == null ? formatDefault(context) : _;
    return axisState;
  },
});

const apiRender = (context, state) => ({
  render: selection => {
    const { _axis, scale, format, id, size } = state;
    let tick = null;

    const g = selection
      .append('svg')
      .datum({ id })
      .attr('width', size)
      .attr('height', Math.max(28, -_axis.tickSize()))
      .append('g')
      .attr('transform', 'translate(0,' + 4 + ')')
      .call(_axis);

    context.on('change.axis-' + id, () => {
      g.call(_axis);
      if (!tick)
        tick = select(
          g.node().appendChild(
            g
              .selectAll('text')
              .node()
              .cloneNode(true)
          )
        )
          .style('display', 'none')
          .text(null);
    });

    context.on('focus.axis-' + id, i => {
      if (tick) {
        if (i == null) {
          tick.style('display', 'none');
          g.selectAll('text').style('fill-opacity', null);
        } else {
          tick
            .style('display', null)
            .attr('x', i)
            .text(format(scale.invert(i)));
          const dx = tick.node().getComputedTextLength() + 6;
          g
            .selectAll('text')
            .style('fill-opacity', d => (Math.abs(scale(d) - i) < dx ? 0 : 1));
        }
      }
    });
  },
});

const apiTicks = axisState => ({
  ticks: (...args) => {
    axisState._axis.ticks(args);
    return axisState;
  },
});

const apiOrient = axisSate => ({
  orient: orient => {
    const { context } = axisSate;
    switch (orient) {
      case 'top':
        axisSate._axis = axisTop().scale(context._scale);
        break;
      case 'bottom':
        axisSate._axis = axisBottom().scale(context._scale);
        break;
      case 'left':
        axisSate._axis = axisLeft().scale(context._scale);
        break;
      case 'right':
        axisSate._axis = axisRight().scale(context._scale);
        break;
      case 'default':
        console.warn('orient shall be one of bottom|top|left|right');
        break;
      default:
        console.warn('orient shall be one of bottom|top|left|right');
        break;
    }

    return axisSate;
  },
});

const apiAxis = context => ({
  axis: () => {
    const axisState = {
      context,
      size: context._size,
      scale: context._scale,
      _axis: axisBottom().scale(context._scale),
      format: formatDefault(context),
      id: ++context._id,
    };

    return Object.assign(
      axisState,
      apiRemove(axisState),
      apiFocusFormat(axisState),
      apiTicks(axisState),
      apiOrient(axisState),
      apiRender(context, axisState)
    );
  },
});

export default apiAxis;
