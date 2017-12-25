import { values } from './lib/index';

values(1, 2, 3)
    .if((f, s, t) => f + t > s)
        .then((f, s, t) => [f + t])
        .else((f, s, t) => [s])
    .then<number>(n => [n + 1])
    .every<number>(
        n => [n + 1],
        n => [n - 1],
        n => [n],
        n => [n ** 2]
    )
    .evalAsync()
    .then(result => {
        console.log(result);
    });
