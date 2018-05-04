import { scaleLinear } from 'd3-scale';
import { interpolateRound } from 'd3-interpolate';
import { format } from 'd3-format';

import runComparison from './run';
import apiRemove from './apiRemove';
import apiMisc from './apiMisc';

const initState = context => ({
  width: context.size(),
  height: 120,
  scale: scaleLinear().interpolate(interpolateRound),
  primary: d => d[0],
  secondary: d => d[1],
  extent: null,
  title: d => d,
  formatPrimary: format('.2s'),
  formatChange: format('+.0%'),
  colors: ['#9ecae1', '#225b84', '#a1d99b', '#22723a'],
  strokeWidth: 1.5,
});

const apiComparison = context => ({
  comparison: selection => {
    const state = initState(context);

    runComparison(state, selection);

    return Object.assign(state, apiRemove(state), apiMisc(state));
  },
});

export default apiComparison;
