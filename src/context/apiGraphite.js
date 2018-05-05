import { json, text } from 'd3-fetch';

// Helper method for parsing graphite's raw format.
const parseGraphite = text => {
  const i = text.indexOf('|'),
    meta = text.substring(0, i),
    c = meta.lastIndexOf(','),
    b = meta.lastIndexOf(',', c - 1),
    a = meta.lastIndexOf(',', b - 1),
    start = meta.substring(a + 1, b) * 1000,
    step = meta.substring(c + 1) * 1000;
  return text
    .substring(i + 1)
    .split(',')
    .slice(1) // the first value is always None?
    .map(d => +d);
};

const DateFormatter = time => Math.floor(time / 1000);

const apiGraphite = context => ({
  graphite: (host = '') => {
    return {
      toString: () => host, // Returns the graphite host.
      find: (pattern, callback) => {
        json(
          host +
            '/metrics/find?format=completer' +
            '&query=' +
            encodeURIComponent(pattern)
        ).then(result => {
          if (!result) return callback(new Error('unable to find metrics'));
          callback(
            null,
            result.metrics.map(function(d) {
              return d.path;
            })
          );
        });
      },
      metric: expression => {
        let sum = 'sum';

        const metric = context.metric((start, stop, step, callback) => {
          let target = expression;

          // Apply the summarize, if necessary.
          if (step !== 1e4)
            target =
              'summarize(' +
              target +
              ",'" +
              (!(step % 36e5)
                ? step / 36e5 + 'hour'
                : !(step % 6e4)
                  ? step / 6e4 + 'min'
                  : step / 1e3 + 'sec') +
              "','" +
              sum +
              "')";

          text(
            host +
            '/render?format=raw' +
            '&target=' +
            encodeURIComponent('alias(' + target + ",'')") +
            '&from=' +
            DateFormatter(start - 2 * step) + // off-by-two?
              '&until=' +
              DateFormatter(stop - 1000)
          ).then(text => {
            if (!text) return callback(new Error('unable to load data'));
            callback(null, parseGraphite(text));
          });
        }, (expression += ''));

        metric.summarize = _sum => {
          sum = _sum;
          return metric;
        };

        return metric;
      },
    };
  },
});

export default apiGraphite;
