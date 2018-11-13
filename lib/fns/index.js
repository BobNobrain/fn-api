const { f } = require('../Function');
const ParityAttribute = require('../attrs/ParityAttribute');
const SignAttribute = require('../attrs/SignAttribute');

const plus = f((n1, n2) => n1 + n2, {
    parity: (p1, p2) => {
        if (p1 === ParityAttribute.INDETERMINATE) return ParityAttribute.INDETERMINATE;
        return (p1 + p2) % 2;
    },
    sign: (s1, s2) => {
        if (s1 === SignAttribute.INDETERMINATE) {
            return SignAttribute.INDETERMINATE;
        }
        if (s1 === SignAttribute.ZERO) return s2;
        if (s1 === SignAttribute.POSITIVE && s2 === SignAttribute.POSITIVE) return SignAttribute.POSITIVE;
        if (s1 === SignAttribute.NEGATIVE && s2 === SignAttribute.NEGATIVE) return SignAttribute.NEGATIVE;
        return SignAttribute.INDETERMINATE;
    }
});

plus.partial = n1 => f(n2 => n1 + n2, {
    parity: p2 => plus.attrs.parity(new ParityAttribute(n1).value, p2),
    sign: s2 => plus.attrs.sign(new SignAttribute(n1).value, s2)
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

mulBy.uncurried = (a, b) => mulBy(a)(b);

module.exports = {
    plus,
    mulBy
};
