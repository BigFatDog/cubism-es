import { mouse, select } from 'd3-selection';

const runHorizon = (context, state, selection) => {
  const { width, height } = state;

  selection
    .on('mousemove.horizon', function() {
      context.focus(Math.round(mouse(this)[0]));
    })
    .on('mouseout.horizon', () => context.focus(null));

  selection
    .append('canvas')
    .attr('width', width)
    .attr('height', height);

  selection
    .append('span')
    .attr('class', 'title')
    .text(title);

  selection.append('span').attr('class', 'value');

  selection.each(function(d, i) {
    const id = ++context._id,
      metric_ = typeof metric === 'function' ? metric(d, i) : metric,
      colors_ = typeof colors === 'function' ? colors(d, i) : colors,
      extent_ = typeof extent === 'function' ? extent(d, i) : extent,
      step = context.step(),
      canvas = select(this).select('canvas'),
      span = select(this).select('.value'),
      m = colors_.length >> 1;

    let start = -Infinity,
      max_,
      y1,
      ready;

    canvas.datum({ id: id, metric: metric_ });
    const ctx = canvas.node().getContext('2d');

    function change(start1, stop) {
      ctx.save();

      // compute the new extent and ready flag
      let extent = metric_.extent();
      ready = extent.every(isFinite);
      if (extent_ != null) extent = extent_;

      // if this is an update (with no extent change), copy old values!
      let i0 = 0,
        max = Math.max(-extent[0], extent[1]);
      if (this === context) {
        if (max == max_) {
          i0 = width - cubism_metricOverlap;
          const dx = (start1 - start) / step;
          if (dx < width) {
            const canvas0 = buffer.getContext('2d');
            canvas0.clearRect(0, 0, width, height);
            canvas0.drawImage(
              canvas.canvas,
              dx,
              0,
              width - dx,
              height,
              0,
              0,
              width - dx,
              height
            );
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(canvas0.canvas, 0, 0);
          }
        }
        start = start1;
      }

      // update the domain
      scale.domain([0, (max_ = max)]);

      // clear for the new data
      ctx.clearRect(i0, 0, width - i0, height);

      // record whether there are negative values to display
      let negative;

      // positive bands
      for (let j = 0; j < m; ++j) {
        ctx.fillStyle = colors_[m + j];

        // Adjust the range based on the current band index.
        let y0 = (j - m + 1) * height;
        scale.range([m * height + y0, y0]);
        y0 = scale(0);

        for (let i = i0, n = width, y1; i < n; ++i) {
          y1 = metric_.valueAt(i);
          if (y1 <= 0) {
            negative = true;
            continue;
          }
          if (y1 === undefined) continue;
          ctx.fillRect(i, (y1 = scale(y1)), 1, y0 - y1);
        }
      }

      if (negative) {
        // enable offset mode
        if (mode === 'offset') {
          ctx.translate(0, height);
          ctx.scale(1, -1);
        }

        // negative bands
        for (let j = 0; j < m; ++j) {
          ctx.fillStyle = colors_[m - 1 - j];

          // Adjust the range based on the current band index.
          let y0 = (j - m + 1) * height;
          scale.range([m * height + y0, y0]);
          y0 = scale(0);

          for (let i = i0, n = width, y1; i < n; ++i) {
            y1 = metric_.valueAt(i);
            if (y1 >= 0) continue;
            ctx.fillRect(i, scale(-y1), 1, y0 - scale(-y1));
          }
        }
      }

      ctx.restore();
    }

    function focus(i) {
      if (i == null) i = width - 1;
      const value = metric_.valueAt(i);
      span.datum(value).text(isNaN(value) ? null : format);
    }

    // Update the chart when the context changes.
    context.on('change.horizon-' + id, change);
    context.on('focus.horizon-' + id, focus);

    // Display the first metric change immediately,
    // but defer subsequent updates to the canvas change.
    // Note that someone still needs to listen to the metric,
    // so that it continues to update automatically.
    metric_.on('change.horizon-' + id, function(start, stop) {
      change(start, stop), focus();
      if (ready) metric_.on('change.horizon-' + id, cubism_identity);
    });
  });
};

const apiRemove = context => ({
  remove: selection => {
    selection.on('mousemove.horizon', null).on('mouseout.horizon', null);

    const remove = d => {
      d.metric.on('change.horizon-' + d.id, null);
      context.on('change.horizon-' + d.id, null);
      context.on('focus.horizon-' + d.id, null);
    };

    selection
      .selectAll('canvas')
      .each(remove)
      .remove();

    selection.selectAll('.title,.value').remove();
  },
});

const apiMisc = state => ({
  mode: (_ = null) => {
    if (_ === null) return state.mode;
    state.mode = _ + '';
    return state;
  },

  height: (_ = null) => {
    if (_ === null) return state.height;
    state.height = +_;
    return state;
  },

  metric: (_ = null) => {
    if (_ === null) return state.metric;
    state.metric = +_;
    return state;
  },

  scale: (_ = null) => {
    if (_ === null) return state.scale;
    state.scale = +_;
    return state;
  },

  extent: (_ = null) => {
    if (_ === null) return state.extent;
    state.extent = +_;
    return state;
  },

  title: (_ = null) => {
    if (_ === null) return state.title;
    state.title = +_;
    return state;
  },

  format: (_ = null) => {
    if (_ === null) return state.format;
    state.format = +_;
    return state;
  },
  colors: (_ = null) => {
    if (_ === null) return state.colors;
    state.colors = +_;
    return state;
  },
});

const apiHorizon = context => ({
  horizion: selection => {
    const state = {
      mode: 'offset',
      buffer: document.createElement('canvas'),
      width: (buffer.width = context.size()),
      height: (buffer.height = 30),
      scale: d3.scale.linear().interpolate(d3.interpolateRound),
      metric: d => d,
      extent: null,
      title: d => d,
      format: d3.format('.2s'),
      colors: [
        '#08519c',
        '#3182bd',
        '#6baed6',
        '#bdd7e7',
        '#bae4b3',
        '#74c476',
        '#31a354',
        '#006d2c',
      ],
    };

    runHorizon(context, state, selection);

    return Object.assign(state, apiRemove(state), apiMisc(state));
  },
});

export default apiHorizon;
