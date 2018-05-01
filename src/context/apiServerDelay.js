import update from './update';

// The server delay is the amount of time we wait for the server to compute a
// metric. This delay may result from clock skew or from delays collecting
// metrics from various hosts. Defaults to 4 seconds.
const apiServerDelay = state => ({
  serverDelay: (_serverDelay = null) => {
    const { serverDelay } = state;
    if (_serverDelay === null) return serverDelay;
    state.serverDelay = +_serverDelay;
    return update(state);
  },
});

export default apiServerDelay;
