import find_librato_resolution from './find_librato_resolution';

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
    find_librato_resolution(sdate, edate, step);
  return url_prefix + '?' + params;
};

export default make_url;
