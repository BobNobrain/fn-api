import { values, f } from './lib/index';
import { ParityAttribute } from './lib/attrs/ParityAttribute';
import { SignAttribute } from './lib/attrs/SignAttribute';

const plus = (n1: number) => f((n2: number) => n1 + n2, {
    parity: p => (p + new ParityAttribute(n1).value) % 2,
    sign: s => {
        if (s === 0) return new SignAttribute(n1).value;
        if (s > 0 && n1 > 0) return 1;
        if (s < 0 && n1 < 0) return -1;
    }
});

const mulBy = (a: number) => f((b: number) => a * b, {
    parity: p => ((new ParityAttribute(a).value as number) % 2 === 0) ? 0 : p,
    sign: s => (new SignAttribute(a).value as number) * s
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
