import { dispatch } from 'd3-dispatch';

import apiAlias from './apiAlias';
import apiExtent from './apiExtent';
import apiOn from './apiOn';
import apiPrepare from './apiPrepare';
import apiShift from './apiShift';
import apiValueAt from './apiValueAt';

const apiMetric = context => ({
  metric: (request, name) => {
    const metricState = {
      context,
      id: '.metric-' + ++context._id,
      start: -Infinity,
      stop: null,
      step: context.step,
      size: context.size,
      values: [],
      event: dispatch('change'),
      listening: 0,
      fetching: false,
      valueAt: () => NaN,
    };

    return Object.assign(
      metricState,
      apiOn(metricState),
      apiPrepare(metricState, request),
      apiValueAt(metricState),
      apiAlias(metricState),
      apiShift(metricState, request),
      apiExtent(metricState)
    );
  },
});

export default apiMetric;
