import { json } from 'd3-fetch';

import downUpSampling from './downUpSampling';
import makeUrl from './makeUrl';

/* All the logic to query the librato API is here */
const request = (composite, user, token) => ({
  fire: (isdate, iedate, step, callback_done) => {
    const a_values = []; /* Store partial values from librato */
    const full_url = makeUrl(isdate, iedate, step, composite);
    const auth_string = 'Basic ' + btoa(user + ':' + token);

    /*
     * Librato has a limit in the number of measurements we get back in a request (100).
     * We recursively perform requests to the API to ensure we have all the data points
     * for the interval we are working on.
     */
    json(full_url)
      .header('X-Requested-With', 'XMLHttpRequest')
      .header('Authorization', auth_string)
      .header('Librato-User-Agent', 'cubism/' + cubism.version)
      .then((data) => {
        if (data.measurements.length === 0) {
          return;
        }
        data.measurements[0].series.forEach(function (o) {
          a_values.push(o);
        });

        const still_more_values = 'query' in data && 'next_time' in data.query;
        if (still_more_values) {
          request(makeUrl(data.query.next_time, iedate, step));
        } else {
          const a_adjusted = downUpSampling(isdate, iedate, step, a_values);
          callback_done(a_adjusted);
        }
      })
      .catch((error) => console.error(error));
  },
});

export default request;
