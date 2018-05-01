import { json } from 'd3-fetch';

const apiGangliaWeb = context => ({
  gangliaWeb: config => {
    const host = config.host || '';
    let uriPathPrefix = config.uriPathPrefix || '/ganglia2/';

    /* Add leading and trailing slashes, as appropriate. */
    if (uriPathPrefix[0] !== '/') {
      uriPathPrefix = '/' + uriPathPrefix;
    }

    if (uriPathPrefix[uriPathPrefix.length - 1] !== '/') {
      uriPathPrefix += '/';
    }

    return {
      toString: () => host + uriPathPrefix,
      metric: metricInfo => {
        /* Store the members from metricInfo into local variables. */
        const {
          clusterName,
          metricName,
          hostName,
          onChangeCallback,
        } = metricInfo;
        const isReport =
          metricInfo.isReport === undefined ? false : metricInfo.isReport;
        /* Reasonable (not necessarily pretty) default for titleGenerator. */
        const defaultTitleGenerator = unusedMetricInfo =>
          `clusterName:${clusterName} metricName:${metricName} hostName:${hostName}`;
        const titleGenerator =
          metricInfo.titleGenerator || defaultTitleGenerator;

        /* Default to plain, simple metrics. */
        const metricKeyName = isReport ? 'g' : 'm';

        const metricFn = (start, stop, step, callback) => {
          const constructGangliaWebRequestQueryParams = () =>
            `c=${clusterName}&${metricKeyName}=${metricName}&h=${hostName}` +
            '&cs=' +
            start / 1000 +
            '&ce=' +
            stop / 1000 +
            '&step=' +
            step / 1000 +
            '&graphlot=1';

          json(
            host +
              uriPathPrefix +
              'graph.php?' +
              constructGangliaWebRequestQueryParams()
          )
            .then(result => {
              if (result === undefined || result === null) {
                return callback(new Error('Unable to fetch GangliaWeb data'));
              }

              callback(null, result[0].data);
            })
            .catch(e =>
              callback(new Error(`Unable to fetch GangliaWeb data: Error ${e}`))
            );
        };
        titleGenerator(metricInfo);

        const gangliaWebMetric = context.metric(metricFn);

        gangliaWebMetric.toString = () => titleGenerator(metricInfo);

        /* Allow users to run their custom code each time a gangliaWebMetric changes.
                 *
                 * TODO Consider abstracting away the naked Cubism call, and instead exposing
                 * a callback that takes in the values array (maybe alongwith the original
                 * start and stop 'naked' parameters), since it's handy to have the entire
                 * dataset at your disposal (and users will likely implement onChangeCallback
                 * primarily to get at this dataset).
                 */
        if (onChangeCallback) {
          gangliaWebMetric.on('change', onChangeCallback);
        }

        return gangliaWebMetric;
      },
    };
  },
});

export default apiGangliaWeb;
