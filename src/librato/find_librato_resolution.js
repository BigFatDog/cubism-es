import find_ideal_librato_resolution from './find_ideal_librato_resolution';

const find_librato_resolution = (sdate, edate, step) => {
  const i_size = edate - sdate, // interval size
    month = 2419200,
    week = 604800,
    two_days = 172800;

  if (i_size > month) return 3600;

  const ideal_res = find_ideal_librato_resolution(step);

  /*
     * Now we have the ideal resolution, but due to the retention policies at librato, maybe we have
     * to use a higher resolution.
     * http://support.metrics.librato.com/knowledgebase/articles/66838-understanding-metrics-roll-ups-retention-and-grap
     */
  if (i_size > week && ideal_res < 900) return 900;
  else if (i_size > two_days && ideal_res < 60) return 60;
  else return ideal_res;
};

export default find_librato_resolution;
