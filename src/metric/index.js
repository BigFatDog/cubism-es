import { dispatch } from 'd3-dispatch';

import apiAlias from './apiAlias';
import apiExtent from './apiExtent';
import apiOn from './apiOn';
import apiPrepare from './apiPrepare';
import apiShift from './apiShift';
import apiValueAt from './apiValueAt';
import apiOperator from './apiOperator';

const apiToString = name => ({
  toString: () => name,
});

const apiMetric = context => ({
  metric: (request, name) => {
    const metricState = {
      context,
      _id: '.metric-' + ++context._id,
      _start: -Infinity,
      _stop: null,
      _step: context.step(),
      _size: context.size(),
      _values: [],
      _event: dispatch('change'),
      _listening: 0,
      _fetching: false,
      _valueAt: () => NaN,
    };

    const metric = Object.assign(
      metricState,
      apiOn(metricState, request),
      apiPrepare(metricState, request),
      apiValueAt(metricState),
      apiAlias(metricState),
      apiShift(metricState, request),
      apiExtent(metricState),
      apiToString(name)
    );

    return Object.assign(metric, apiOperator(metric));
  },
});

export default apiMetric;
