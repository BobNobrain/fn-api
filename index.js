const { values } = require('./lib/index');
const ParityAttribute = require('./lib/attrs/ParityAttribute');
const SignAttribute = require ('./lib/attrs/SignAttribute');

const { plus, mulBy } = require('./lib/fns');

const computationTree =
    values(1, 2, 3)
        .if(() => Math.random() > 0.5)
            .then(mulBy(3))
            .else(mulBy(4))
        // .map(mulBy(2));

const attributes = computationTree.deriveAttributes(ParityAttribute);
console.log(attributes.join(', '));

console.log(
    values(-10, 10, 20, -20, 0)
        .map(plus(10))
        .map(mulBy(-1))
        .deriveAttributes(SignAttribute)
        .join(', ')
);
