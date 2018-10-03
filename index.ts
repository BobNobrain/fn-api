import { values } from './lib/index';

values(1, 2, 3)
    .if((f, s, t) => f + t > s)
        .then((f, s, t) => [f + t])
        .else((f, s, t) => [s])
    .shrink(n => n + 1)
    .every(
        n => n + 1,
        n => n - 1,
        n => n,
        n => n ** 2
    )
    .map(n => n + 1)
    .shrink((a, b, c, d) => a + b / c - d)
    .evalFirstAsync()
    .then(result => {
        console.log('My example', result);
    });

// values(...('abc'.split('')))
//     .map(c => `"${c}"`)
//     .shrink((a, b, c) => [c, b, a])
//     .evalAsync()
//     .then(results => console.log(results));

const computation = values(2, 3)
    .every(
        (a, b) => ((a + b)/2) ** 2,
        (a, b) => ((a - b)/2) ** 2,
        (a, b) => Math.max(a, b),
        (a, b) => Math.min(a, b)
    )
    .then<number>((halfSum, halfDiff, mx, mn) => [(halfSum + halfDiff)*mx/mn]);

computation.evalAsync()
    .then(([v]) => console.log('Documentation example', v));
