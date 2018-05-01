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
import update from './update';

import apiMetric from '../metric';
import apiCube from './apiCube';
import apiAxis from './apiAxis';
import apiRule from './apiRule';
import apiHorizon from './apiHorizon';

import apiGangliaWeb from './apiGangliaWeb';
import apiLibrato from '../librato';
import apiGraphite from './apiGraphite';
import apiComparison from "./apiComparison";

const context = () => {
  const state = {
    _id: 1,
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

  timeout = setTimeout(index.start, 10);

  const _context = Object.assign(
    {},
    apiStart(state),
    apiStop(state),
    apiOn(state),
    apiFocus(state),
    apiClientDelay(state),
    apiSize(state),
    apiServerDelay(state),
    apiCube(state),
    apiMetric(state),
    apiAxis(state),
    apiRule(state),
    apiHorizon(state),
    apiComparison(state)
  );

  const { focus } = state;

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
    apiGangliaWeb(cubismContext),
    apiLibrato(cubismContext),
    apiGraphite(cubismContext)
  );
};

export default context;
