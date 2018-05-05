import { scaleLinear } from 'd3-scale';
import { format } from 'd3-format';
import { interpolateRound } from 'd3-interpolate';

import runHorizon from './run';
import apiMisc from './apiMisc';
import apiRemove from './apiRemvoe';

const apiHorizon = context => ({
  horizon: function(selection) {
    const buffer = document.createElement('canvas');
    buffer.width = context.size();
    buffer.height = 30;

    const state = {
      _mode: 'offset',
      _buffer: buffer,
      _width: buffer.width,
      _height: buffer.height,
      _scale: scaleLinear().interpolate(interpolateRound),
      _metric: d => d,
      _extent: null,
      _title: d => d,
      _format: format('.2s'),
      _colors: [
        '#08519c',
        '#3182bd',
        '#6baed6',
        '#bdd7e7',
        '#bae4b3',
        '#74c476',
        '#31a354',
        '#006d2c',
      ],
    };

    runHorizon(context, state, selection);

    return Object.assign(state, apiRemove(state), apiMisc(state));
  },
});

export default apiHorizon;
