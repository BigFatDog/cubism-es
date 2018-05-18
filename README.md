# @bigfatdog/cubism
This project is an ES6 module of [cubism](https://github.com/square/cubism), based on D3V5.  For more information, please
visit square/cubism's [home page](http://square.github.io/cubism/) and [wiki](https://github.com/square/cubism/wiki)


## Usage:

1. Install

```
npm install @bigfatdog/cubism --save
```

2. ES6 Usage

```
import { context } from 'cubism';

```

## API Breaks
```
// in cubism
d3.select(...).call(cubism.context)

// in @BigFatDog/cubism
const a = d3.select(...)
cubism.context(a).height(30)

```

## Demo
the following samples work, you can try them by downloading this project and running `npm install` and `npm run dev`:

* Mike, Bostock's [stock demo](https://bost.ocks.org/mike/cubism/intro/demo-stocks.html)
* Patrick, Thompson's [Discrete Cubism](http://bl.ocks.org/patrickthompson/4d508eb3b8feac90762e)
* Square Inc's [demo](http://square.github.io/cubism/)
* Mike, Bostock's [random demo](https://bost.ocks.org/mike/cubism/intro/demo-random.html)
* Comparison

## Development
1. Clone repository
2. Run commands
```
npm install         // install dependencies
npm run dev         // view demos in web browser at localhost:3004
npm run build       // build
npm run test        // run tests only
npm run test:cover  // run tests and view coverage report
```

## Limitation
Graphite, Cube and GangliaWeb have not been verified yet.

## Credits
Contributors of the original [cubism](https://github.com/square/cubism).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details



