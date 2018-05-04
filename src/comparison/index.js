import { scaleLinear } from 'd3-scale';
import { interpolateRound } from 'd3-interpolate';
import { format } from 'd3-format';

import runComparison from './run';
import apiRemove from './apiRemove';
import apiMisc from './apiMisc';

const initState = context => ({
  context,
  _width: context.size(),
  _height: 120,
  _scale: scaleLinear().interpolate(interpolateRound),
  _primary: d => d[0],
    _secondary: d => d[1],
    _extent: null,
    _title: d => d,
    _formatPrimary: format('.2s'),
    _formatChange: format('+.0%'),
    _colors: ['#9ecae1', '#225b84', '#a1d99b', '#22723a'],
    _strokeWidth: 1.5,
});

const apiComparison = context => ({
  comparison: selection => {
    const state = initState(context);

    runComparison(state, selection);

    return Object.assign(state, apiRemove(state), apiMisc(state));
  },
});

export default apiComparison;
