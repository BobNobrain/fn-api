const { values } = require('./lib/index');
const ParityAttribute = require('./lib/attrs/ParityAttribute');
// const SignAttribute = require ('./lib/attrs/SignAttribute');
const { plus, multiply } = require('./lib/func/arithmetics');

const randomOrgValues = require('./random');

const computationTree =
    randomOrgValues(10)
        .map(plus.partial(2))
        .if(() => Math.random() > 0.5)
            .then(multiply.partial(3))
            .else(multiply.partial(4))

        .zipWith(
            multiply,
            values(2, 3, 4, 5, 6, 7, 9, 10, 11, 22)
        )
;

const attributes = computationTree.deriveAttributes(ParityAttribute);
console.log(attributes.join(', '));

computationTree.evalAsync()
    .then(values => console.log(values.join(', ')))
    .catch(error => console.error(error))
;
