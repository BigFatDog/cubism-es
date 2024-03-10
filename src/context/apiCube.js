import { isoFormat } from 'd3-time-format';
import { json } from 'd3-fetch';

const apiCube = (context) => ({
  cube: (host = '') => ({
    toString: () => host,
    metric: (expression) => {
      return context.metric(
        (start, stop, step, callback) => {
          json(
            host +
              '/1.0/metric' +
              '?expression=' +
              encodeURIComponent(expression) +
              '&start=' +
              isoFormat(start) +
              '&stop=' +
              isoFormat(stop) +
              '&step=' +
              step
          ).then((data) => {
            if (!data) return callback(new Error('unable to load data'));
            callback(
              null,
              data.map((d) => d.value)
            );
          });
        },
        (expression += '')
      );
    },
  }),
});

export default apiCube;
