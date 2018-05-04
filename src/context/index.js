import { dispatch } from 'd3-dispatch';
import { scaleTime } from 'd3-scale';
import { select, event } from 'd3-selection';
import apiStart from './apiStart';
import apiStop from './apiStop';
import apiOn from './apiOn';
import apiFocus from './apiFocus';
import apiClientDelay from './apiClientDelay';
import apiServerDelay from './apiServerDelay';
import apiSize from './apiSize';
import apiStep from './apiStep';
import update from './update';

import apiMetric from '../metric';
import apiCube from './apiCube';
import apiAxis from './apiAxis';
import apiRule from './apiRule';
import apiHorizon from './apiHorizon';

import apiGangliaWeb from './apiGangliaWeb';
import apiLibrato from '../librato';
import apiGraphite from './apiGraphite';
import apiComparison from '../comparison';

const config = {
  id: 1,
  step: 1e4, // ten seconds, in milliseconds
  size: 1440, // ten seconds, in milliseconds
  serverDelay: 5e3,
  clientDelay: 5e3,
  event: dispatch('prepare', 'beforechange', 'change', 'focus'),
  start0: null,
  stop0: null, // the start and stop for the previous change event
  start1: null,
  stop1: null, // the start and stop for the next prepare event
  timeout: null,
  focus: null,
  scale: scaleTime().range([0, 1440]),
};

const context = () => {
  const state = {
    config,
  };

  const context = Object.assign(
    state,
    apiAxis(state),
    apiComparison(state),
    apiCube(state),
    apiClientDelay(state),
    apiFocus(state),
    apiMetric(state),
    apiOn(state),
    apiRule(state),
    apiServerDelay(state),
    apiSize(state),
    apiStart(state),
    apiStop(state),
    apiStep(state)
  );

  state.config.timeout = setTimeout(context.config.start, 10);

  const {
    focus,
    config: { size },
  } = context;

  select(window).on('keydown.context-' + ++context.config.id, function() {
    switch (!event.metaKey && event.keyCode) {
      case 37: // left
        if (focus == null) context.focus = size - 1;
        if (focus > 0) context.focus(--context.focus);
        break;
      case 39: // right
        if (focus == null) context.focus = size - 2;
        if (focus < _size - 1) context.focus(++context.focus);
        break;
      default:
        return;
    }

    event.preventDefault();
  });

  const cubismContext = update(context);

  return Object.assign(
    cubismContext,
    apiHorizon(cubismContext),
    apiGangliaWeb(cubismContext),
    apiLibrato(cubismContext),
    apiGraphite(cubismContext)
  );
};

export default context;
