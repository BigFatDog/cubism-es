import { json, text } from 'd3-fetch';

// Helper method for parsing graphite's raw format.
const parseGraphite = (data, alias) => {
  const text = data.split('\n').filter(line => line.startsWith(alias))[0];
  if (!text) {
    return [];
  }

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

const targetData = (json, target) => {
  return json.filter(d => d.target === target).map(d => d.datapoints.map(dp => dp[0]));
};

const _CACHE_SIZE = 3
const REQUEST_CACHE = {}

const request = (target, host, start, stop, step, config = {}) => {
  const alias = config.alias || '';
  const key = target + '_' + alias;

  if (REQUEST_CACHE[key]) {
    let same_requests = REQUEST_CACHE[key].filter(rq => +rq.start === +start && +rq.stop === +rq.stop && rq.step == rq.step);
    if (same_requests.length) {
      return same_requests[0].request;
    }
  }

  let target_str = "";
  if (Array.isArray(target)) {
    target_str = target.map((t, i) => {
      const talias = config.alias[i] || t.split('.').pop();
      return 'target=' + encodeURIComponent('alias(' + t + ",'" + talias + "')");
    }).join('&');
  } else {
    target_str = 'target=' + encodeURIComponent('alias(' + target + ",'" + alias + "')");
  }

  const p = text(
      host +
      '/render?format=' + (config.format || 'raw') +
      '&' + target_str +
      '&from=' +
      DateFormatter(start - 2 * step) + // off-by-two?
        '&until=' +
        DateFormatter(stop - 1000)
  );

  REQUEST_CACHE[key] = REQUEST_CACHE[key] || [];
  if (REQUEST_CACHE[key].length >= _CACHE_SIZE) {
    REQUEST_CACHE[key].shift();
  }

  REQUEST_CACHE[key].push({
    start: start,
    stop: stop,
    step: step,
    request: p
  });

  return p;
};

const createMetric = (context, host, targets, config={}) => {
  let parser = () => [];

  const aliases = config.aliases || targets.map(t => t.split('.').pop());
  const format = config.format || 'raw';

  if (format.toLowerCase() === 'raw') {
    parser = parseGraphite;
  }

  const metrics = targets.map((target, i) => {
    let sum = 'sum';

    const alias = aliases[i];
    const metric = context.metric((start, stop, step, callback) => {

        const t = targets.map(xt => {
          let mt = xt;
          if (step !== 1e4) {
            mt =
              'summarize(' +
              xt +
              ",'" +
              (!(step % 36e5)
                ? step / 36e5 + 'hour'
                : !(step % 6e4)
                  ? step / 6e4 + 'min'
                  : step / 1e3 + 'sec') +
              "','" +
              sum +
              "')";
          }
          return mt;
        });
      const p = request(t, host, start, stop, step, {alias: aliases, format: format});

      p.then(data => {
        if (!data) return callback(new Error('unable to load data'));
        callback(null, parser(data, alias));
      });
    }, target);

    metric.summarize = _sum => {
      sum = _sum;
      return metric;
    };

    return metric.alias(alias);
  });

  return metrics;
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
      multiMetric: (targets, config={}) => {
        return createMetric(context, host, targets, config);
      },
      metric: (expression, config = {}) => {
        return createMetric(context, host, [expression], config)[0];
      },
    };
  },
});

export default apiGraphite;
