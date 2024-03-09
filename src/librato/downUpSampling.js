/*
 * We are most likely not going to get the same number of measurements
 * cubism expects for a particular context: We have to perform down/up
 * sampling
 */
const downUpSampling = (isdate, iedate, step, librato_mm) => {
  const av = [];

  for (let i = isdate; i <= iedate; i += step) {
    const int_mes = [];
    while (librato_mm.length && librato_mm[0].measure_time <= i) {
      int_mes.push(librato_mm.shift().value);
    }

    let v;
    if (int_mes.length) {
      /* Compute the average */
      v =
        int_mes.reduce(function (a, b) {
          return a + b;
        }) / int_mes.length;
    } else {
      /* No librato values on interval */
      v = av.length ? av[av.length - 1] : 0;
    }
    av.push(v);
  }

  return av;
};

export default downUpSampling;
