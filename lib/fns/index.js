const { f } = require('../Function');
const ParityAttribute = require('../attrs/ParityAttribute');
const SignAttribute = require('../attrs/SignAttribute');

const plus = n1 => f(n2 => n1 + n2, {
    parity: p => {
        if (p === ParityAttribute.INDETERMINATE) return ParityAttribute.INDETERMINATE;
        return (p + new ParityAttribute(n1).value) % 2;
    },
    sign: s => {
        if (s === SignAttribute.INDETERMINATE) {
            return SignAttribute.INDETERMINATE;
        }
        const n1Sign = new SignAttribute(n1).value;
        if (s === SignAttribute.ZERO) return n1Sign;
        if (s === SignAttribute.POSITIVE && n1Sign === SignAttribute.POSITIVE) return SignAttribute.POSITIVE;
        if (s === SignAttribute.NEGATIVE && n1Sign === SignAttribute.NEGATIVE) return SignAttribute.NEGATIVE;
        return SignAttribute.INDETERMINATE;
    }
});

const mulBy = a => f(b => a * b, {
    parity: bParity => {
        if (bParity === ParityAttribute.EVEN) return bParity;

        const aParity = new ParityAttribute(a).value;
        if (aParity === ParityAttribute.EVEN) return aParity;

        if (bParity === ParityAttribute.ODD && aParity === ParityAttribute.ODD)
            return ParityAttribute.ODD;

        return ParityAttribute.INDETERMINATE;
    },
    sign: bSign => {
        if (bSign === SignAttribute.ZERO) return SignAttribute.ZERO;
        const aSign = new SignAttribute(a).value;
        if (aSign === SignAttribute.ZERO) return SignAttribute.ZERO;
        if (bSign === SignAttribute.INDETERMINATE || aSign === SignAttribute.INDETERMINATE) {
            return SignAttribute.INDETERMINATE;
        }
        if (bSign === aSign) return SignAttribute.POSITIVE;
        return SignAttribute.NEGATIVE;
    }
});

module.exports = {
    plus,
    mulBy
};
