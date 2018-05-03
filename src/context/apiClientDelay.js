import update from './update';

// The client delay is the amount of additional time we wait to fetch those
// metrics from the server. The client and server delay combined represent the
// age of the most recent displayed metric. Defaults to 1 second.
const apiClientDelay = state => ({
  clientDelay: (_clientDelay = null) => {
    if (_clientDelay === null) return state._clientDelay;
    state._clientDelay = +_clientDelay;
    return update(state);
  },
});

export default apiClientDelay;
