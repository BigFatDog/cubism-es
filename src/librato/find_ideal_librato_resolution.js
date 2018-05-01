/* Given a step, find the best librato resolution to use.
         *
         * Example:
         *
         * (s) : cubism step
         *
         * avail_rsts   1 --------------- 60 --------------- 900 ---------------- 3600
         *                                |    (s)            |
         *                                |                   |
         *                              [low_res             top_res]
         *
         * return: low_res (60)
         */
const find_ideal_librato_resolution = step => {
  const avail_rsts = [1, 60, 900, 3600];
  const highest_res = avail_rsts[0],
    lowest_res = avail_rsts[avail_rsts.length]; // high and lowest available resolution from librato

  /* If step is outside the highest or lowest librato resolution, pick them and we are done */
  if (step >= lowest_res) return lowest_res;

  if (step <= highest_res) return highest_res;

  /* If not, find in what resolution interval the step lands. */
  let iof, top_res, i;
  for (i = step; i <= lowest_res; i++) {
    iof = avail_rsts.indexOf(i);
    if (iof > -1) {
      top_res = avail_rsts[iof];
      break;
    }
  }

  let low_res;
  for (i = step; i >= highest_res; i--) {
    iof = avail_rsts.indexOf(i);
    if (iof > -1) {
      low_res = avail_rsts[iof];
      break;
    }
  }

  /* What's the closest librato resolution given the step ? */
  return top_res - step < step - low_res ? top_res : low_res;
};

export default find_ideal_librato_resolution;
