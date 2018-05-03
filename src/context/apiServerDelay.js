import update from './update';

// The server delay is the amount of time we wait for the server to compute a
// metric. This delay may result from clock skew or from delays collecting
// metrics from various hosts. Defaults to 4 seconds.
const apiServerDelay = state => ({
  serverDelay: (_serverDelay = null) => {
    if (_serverDelay === null) return state._serverDelay;
    state._serverDelay = +_serverDelay;
    return update(state);
  },
});

export default apiServerDelay;
