const { f } = require('../Function');
const ParityAttribute = require('../attrs/ParityAttribute');
const SignAttribute = require('../attrs/SignAttribute');

const plus = n1 => f(n2 => n1 + n2, {
    parity: p => (p + new ParityAttribute(n1).value) % 2,
    sign: s => {
        const n1Sign = new SignAttribute(n1).value;
        if (s === 0) return n1Sign;
        if (s > 0 && n1Sign > 0) return 1;
        if (s < 0 && n1Sign < 0) return -1;
    }
});

const mulBy = a => f(b => a * b, {
    parity: p => ((new ParityAttribute(a).value) % 2 === 0) ? 0 : p,
    sign: s => (new SignAttribute(a).value) * s
});

module.exports = {
    plus,
    mulBy
};
