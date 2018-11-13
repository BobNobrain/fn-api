const { values } = require('./lib/index');
const ParityAttribute = require('./lib/attrs/ParityAttribute');
const SignAttribute = require ('./lib/attrs/SignAttribute');

const { plus, mulBy } = require('./lib/fns');

const computationTree =
    values(1, 2, 3)
        .map(plus.partial(2))
        // .if(() => Math.random() > 0.5)
        //     .then(mulBy(3))
        //     .else(mulBy(4))

        .zipWith(
            plus,
            values(2, 3, 4)
        )
        .fold(plus, 0)

        // .map(mulBy(2));

const attributes = computationTree.deriveAttributes(ParityAttribute);
console.log(attributes.join(', '));

// console.log(
//     values(-10, 10, 20, -20, 0)
//         .map(plus.partial(10))
//         .map(mulBy(-1))
//         .deriveAttributes(SignAttribute)
//         .join(', ')
// );
