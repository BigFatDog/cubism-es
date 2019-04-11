import { select, mouse } from 'd3-selection';

const apiRender = (context, state) => ({
  render: selection => {
    selection.append('div').attr('a', 'b');
    const {
      _width,
      _height,
      _title,
      _metric,
      _colors,
      _extent,
      _scale,
      _buffer,
      _mode,
      _format,
    } = state;

    selection
      .on('mousemove.horizon', function() {
        context.focus(Math.round(mouse(this)[0]));
      })
      .on('mouseout.horizon', () => context.focus(null));

    selection
      .append('canvas')
      .attr('width', _width)
      .attr('height', _height);

    selection
      .append('span')
      .attr('class', 'title')
      .text(_title);

    selection.append('span').attr('class', 'value');

    selection.each(function(d, i) {
      const id = ++context._id,
        metric_ = typeof _metric === 'function' ? _metric(d, i) : _metric,
        colors_ = typeof _colors === 'function' ? _colors(d, i) : _colors,
        extent_ = typeof _extent === 'function' ? _extent(d, i) : _extent,
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
          if (max === max_) {
            i0 = _width - 6;
            const dx = (start1 - start) / step;
            if (dx < _width) {
              const canvas0 = _buffer.getContext('2d');
              canvas0.clearRect(0, 0, _width, _height);
              canvas0.drawImage(
                ctx.canvas,
                dx,
                0,
                _width - dx,
                _height,
                0,
                0,
                _width - dx,
                _height
              );
              ctx.clearRect(0, 0, _width, _height);
              ctx.drawImage(canvas0.canvas, 0, 0);
            }
          }
          start = start1;
        }

        // update the domain
        _scale.domain([0, (max_ = max)]);

        // clear for the new data
        ctx.clearRect(i0, 0, _width - i0, _height);

        // record whether there are negative values to display
        let negative;

        // positive bands
        for (let j = 0; j < m; ++j) {
          ctx.fillStyle = colors_[m + j];

          // Adjust the range based on the current band index.
          let y0 = (j - m + 1) * _height;
          _scale.range([m * _height + y0, y0]);
          y0 = _scale(0);

          for (let i = i0, n = _width, y1; i < n; ++i) {
            y1 = metric_.valueAt(i);
            if (y1 <= 0) {
              negative = true;
              continue;
            }
            if (y1 === undefined) continue;
            ctx.fillRect(i, (y1 = _scale(y1)), 1, y0 - y1);
          }
        }

        if (negative) {
          // enable offset mode
          if (_mode === 'offset') {
            ctx.translate(0, _height);
            ctx.scale(1, -1);
          }

          // negative bands
          for (let j = 0; j < m; ++j) {
            ctx.fillStyle = colors_[m - 1 - j];

            // Adjust the range based on the current band index.
            let y0 = (j - m + 1) * _height;
            _scale.range([m * _height + y0, y0]);
            y0 = _scale(0);

            for (let i = i0, n = _width, y1; i < n; ++i) {
              y1 = metric_.valueAt(i);
              if (y1 >= 0) continue;
              ctx.fillRect(i, _scale(-y1), 1, y0 - _scale(-y1));
            }
          }
        }

        ctx.restore();
      }

      const focus = i => {
        if (i == null) i = _width - 1;
        const value = metric_.valueAt(i);
        span.datum(value).text(isNaN(value) ? null : _format);
      };

      // Update the chart when the context changes.
      context.on('change.horizon-' + id, change);
      context.on('focus.horizon-' + id, focus);

      // Display the first metric change immediately,
      // but defer subsequent updates to the canvas change.
      // Note that someone still needs to listen to the metric,
      // so that it continues to update automatically.
      metric_.on('change.horizon-' + id, function(start, stop) {
        change(start, stop), focus();
        if (ready) metric_.on('change.horizon-' + id, d => d);
      });
    });
  },
});

export default apiRender;
