import findLibratoResolution from './findLibratoResolution';

const make_url = (sdate, edate, step, composite) => {
  const url_prefix = 'https://metrics-api.librato.com/v1/metrics';
  const params =
    'compose=' +
    composite +
    '&start_time=' +
    sdate +
    '&end_time=' +
    edate +
    '&resolution=' +
    findLibratoResolution(sdate, edate, step);
  return url_prefix + '?' + params;
};

export default make_url;
