import { values, f } from './lib/index';
import { ParityAttribute } from './lib/attrs/ParityAttribute';
import { SignAttribute } from './lib/attrs/SignAttribute';

const plus = (n1: number) => f((n2: number) => n1 + n2, {
    parity: p => (p + n1) % 2,
    sign: s => {
        if (s === 0) return Math.sign(n1);
        if (s > 0 && n1 > 0) return 1;
        if (s < 0 && n1 < 0) return -1;
    }
});

const mulBy = (a: number) => f((b: number) => a * b, {
    parity: p => (a % 2 === 0) ? 0 : p,
    sign: s => Math.sign(a) * s
});

const computationTree = values(1, 2, 3)
    .map(mulBy(2))
    .map(plus(1));

const attributes = computationTree.deriveAttributes<ParityAttribute>(ParityAttribute);

console.log(attributes.join(', '));

console.log(
    values(-10, 10, 20, -20, 0)
        .map(plus(10))
        .map(mulBy(-1))
        .deriveAttributes<SignAttribute>(SignAttribute)
        .join(', ')
);
