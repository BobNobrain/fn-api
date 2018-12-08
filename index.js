const { values } = require('./lib/index');
const ParityAttribute = require('./lib/attrs/ParityAttribute');
const SignAttribute = require ('./lib/attrs/SignAttribute');

const { plus, multiple } = require('./lib/func/arithmetics');

const computationTree =
    values(1, 2, 3)
        .map(plus.partial(2))
        .if(() => Math.random() > 0.5)
            .then(multiple.partial(3))
            .else(multiple.partial(4))

        .zipWith(
            plus,
            values(2, 3, 4)
        )
        // .fold(plus, 0)

        // .map(mulBy(2));

const attributes = computationTree.deriveAttributes(ParityAttribute);
console.log(attributes.join(', '));

// computationTree.evalFirstAsync().then(x => console.log('Result ', x));

// console.log(
//     values(-10, 10, 20, -20, 0)
//         .map(plus.partial(10))
//         .map(mulBy(-1))
//         .deriveAttributes(SignAttribute)
//         .join(', ')
// );
