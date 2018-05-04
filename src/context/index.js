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
import apiHorizon from '../horizon';

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
    _id: 1,
    _step: 1e4, // ten seconds, in milliseconds
    _size: 1440, // ten seconds, in milliseconds
    _serverDelay: 5e3,
    _clientDelay: 5e3,
    _event: dispatch('prepare', 'beforechange', 'change', 'focus'),
    _start0: null,
    _stop0: null, // the start and stop for the previous change event
    _start1: null,
    _stop1: null, // the start and stop for the next prepare event
    _timeout: null,
    _focus: null,
    _scale: scaleTime().range([0, 1440]),
  };

  const _context = Object.assign(
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

  state._timeout = setTimeout(_context.start, 10);

  const { focus } = _context;

  select(window).on('keydown.context-' + ++_context._id, function() {
    switch (!event.metaKey && event.keyCode) {
      case 37: // left
        if (focus == null) _context.focus = size - 1;
        if (focus > 0) _context.focus(--_context.focus);
        break;
      case 39: // right
        if (focus == null) _context.focus = size - 2;
        if (focus < size - 1) _context.focus(++_context.focus);
        break;
      default:
        return;
    }

    event.preventDefault();
  });

  const cubismContext = update(_context);

  return Object.assign(
    cubismContext,
    apiHorizon(cubismContext),
    apiGangliaWeb(cubismContext),
    apiLibrato(cubismContext),
    apiGraphite(cubismContext)
  );
};

export default context;
