import { scaleLinear } from 'd3-scale';
import { interpolateRound } from 'd3-interpolate';
import { format } from 'd3-format';
import { mouse, select } from 'd3-selection';

import uuid from '../uuid';

const roundEven = i => i & 0xfffffe;
const roundOdd = i => ((i + 1) & 0xfffffe) - 1;

const initState = context => ({
  width: context.size(),
  height: 120,
  scale: scaleLinear().interpolate(interpolateRound),
  primary: d => d[0],
  secondary: d => d[1],
  extent: null,
  title: d => d,
  formatPrimary: format('.2s'),
  formatChange: format('+.0%'),
  colors: ['#9ecae1', '#225b84', '#a1d99b', '#22723a'],
  strokeWidth: 1.5,
});

const runComparison = (state, selection) => {
    const {
        width,
        height,
        scale,
        primary,
        secondary,
        extent,
        title,
        formatPrimary,
        formatChange,
        colors,
        strokeWidth,
    } = state;

    selection
        .on('mousemove.comparison', function() {
            context.focus(Math.round(mouse(this)[0]));
        })
        .on('mouseout.comparison', () => context.focus(null));

    selection
        .append('canvas')
        .attr('width', width)
        .attr('height', height);

    selection
        .append('span')
        .attr('class', 'title')
        .text(title);

    selection.append('span').attr('class', 'value primary');
    selection.append('span').attr('class', 'value change');

    selection.each(function(d, i) {
        const id = uuid(),
            primary_ =
                typeof primary === 'function' ? primary.call(this, d, i) : primary,
            secondary_ =
                typeof secondary === 'function'
                    ? secondary.call(this, d, i)
                    : secondary,
            extent_ = typeof extent === 'function' ? extent.call(this, d, i) : extent,
            div = select(this),
            canvas = div.select('canvas'),
            spanPrimary = div.select('.value.primary'),
            spanChange = div.select('.value.change');

        let ready = null;

        canvas.datum({ id: id, primary: primary_, secondary: secondary_ });
        const canvasContext = canvas.node().getContext('2d');

        function change(start, stop) {
            canvasContext.save();
            canvasContext.clearRect(0, 0, width, height);

            // update the scale
            const primaryExtent = primary_.extent(),
                secondaryExtent = secondary_.extent(),
                extent = extent_ == null ? primaryExtent : extent_;
            scale.domain(extent).range([height, 0]);
            ready = primaryExtent.concat(secondaryExtent).every(isFinite);

            // consistent overplotting
            const round = (start / context.step()) & 1 ? roundOdd : roundEven;

            // positive changes
            canvasContext.fillStyle = colors[2];
            for (const i = 0, n = width; i < n; ++i) {
                const y0 = scale(primary_.valueAt(i)),
                    y1 = scale(secondary_.valueAt(i));
                if (y0 < y1) canvasContext.fillRect(round(i), y0, 1, y1 - y0);
            }

            // negative changes
            canvasContext.fillStyle = colors[0];
            for (i = 0; i < n; ++i) {
                const y0 = scale(primary_.valueAt(i)),
                    y1 = scale(secondary_.valueAt(i));
                if (y0 > y1) canvasContext.fillRect(round(i), y1, 1, y0 - y1);
            }

            // positive values
            canvasContext.fillStyle = colors[3];
            for (i = 0; i < n; ++i) {
                const y0 = scale(primary_.valueAt(i)),
                    y1 = scale(secondary_.valueAt(i));
                if (y0 <= y1) canvasContext.fillRect(round(i), y0, 1, strokeWidth);
            }

            // negative values
            canvasContext.fillStyle = colors[1];
            for (i = 0; i < n; ++i) {
                const y0 = scale(primary_.valueAt(i)),
                    y1 = scale(secondary_.valueAt(i));
                if (y0 > y1)
                    canvasContext.fillRect(round(i), y0 - strokeWidth, 1, strokeWidth);
            }

            canvasContext.restore();
        }

        const focus = (i = width - 1) => {
            const valuePrimary = primary_.valueAt(i),
                valueSecondary = secondary_.valueAt(i),
                valueChange = (valuePrimary - valueSecondary) / valueSecondary;

            spanPrimary
                .datum(valuePrimary)
                .text(isNaN(valuePrimary) ? null : formatPrimary);

            spanChange
                .datum(valueChange)
                .text(isNaN(valueChange) ? null : formatChange)
                .attr(
                    'class',
                    'value change ' +
                    (valueChange > 0 ? 'positive' : valueChange < 0 ? 'negative' : '')
                );
        };

        const firstChange = (start, stop) => {
            change(start, stop);
            focus();
            if (ready) {
                primary_.on('change.comparison-' + id, d => d);
                secondary_.on('change.comparison-' + id, d => d);
            }
        };

        // Display the first primary change immediately,
        // but defer subsequent updates to the context change.
        // Note this someone still needs to listen to the metric,
        // so this it continues to update automatically.
        primary_.on('change.comparison-' + id, firstChange);
        secondary_.on('change.comparison-' + id, firstChange);

        // Update the chart when the context changes.
        context.on('change.comparison-' + id, change);
        context.on('focus.comparison-' + id, focus);
    });
}

const apiRemove = state => ({
    remove: selection => {
      const { context } = state;
          const _remove = d => {
              d.primary.on('change.comparison-' + d.id, null);
              d.secondary.on('change.comparison-' + d.id, null);
              context.on('change.comparison-' + d.id, null);
              context.on('focus.comparison-' + d.id, null);
          };

          selection.on('mousemove.comparison', null).on('mouseout.comparison', null);
          selection
              .selectAll('canvas')
              .each(_remove)
              .remove();

          selection.selectAll('.title,.value').remove();
    }
})


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

const apiComparison = context => ({
    comparison: selection => {
        const state = initState(contet);

        runComparison(state);

        return Object.assign(state, apiRemove(state), apiMisc(state))
    }
});

export default apiComparison