const attributedFunction = require('./AttributedFunction');
const ParityAttribute = require('../attrs/ParityAttribute');
const SignAttribute = require('../attrs/SignAttribute');

const plus = attributedFunction((n1, n2) => n1 + n2);

plus.attribute(ParityAttribute, (p1, p2) => {
    if (p1 === ParityAttribute.INDETERMINATE) return ParityAttribute.INDETERMINATE;
    return (p1 + p2) % 2;
});
plus.attribute(SignAttribute, (s1, s2) => {
    if (s1 === SignAttribute.INDETERMINATE) {
        return SignAttribute.INDETERMINATE;
    }
    if (s1 === SignAttribute.ZERO) return s2;
    if (s1 === SignAttribute.POSITIVE && s2 === SignAttribute.POSITIVE) return SignAttribute.POSITIVE;
    if (s1 === SignAttribute.NEGATIVE && s2 === SignAttribute.NEGATIVE) return SignAttribute.NEGATIVE;
    return SignAttribute.INDETERMINATE;
});

plus.partial = n1 => attributedFunction(n2 => n1 + n2, {
    parity: p2 => plus.attrs.parity(new ParityAttribute(n1).value, p2),
    sign: s2 => plus.attrs.sign(new SignAttribute(n1).value, s2)
});

const multiple = attributedFunction((a, b) => a * b);

ParityAttribute.defineFor(multiple, (aParity, bParity) => {
    if (bParity === ParityAttribute.EVEN) return bParity;
    if (aParity === ParityAttribute.EVEN) return aParity;

    if (bParity === ParityAttribute.ODD && aParity === ParityAttribute.ODD)
        return ParityAttribute.ODD;

    return ParityAttribute.INDETERMINATE;
});

SignAttribute.defineFor(multiple, (aSign, bSign) => {
    if (bSign === SignAttribute.ZERO) return SignAttribute.ZERO;
    if (aSign === SignAttribute.ZERO) return SignAttribute.ZERO;

    if (bSign === SignAttribute.INDETERMINATE || aSign === SignAttribute.INDETERMINATE) {
        return SignAttribute.INDETERMINATE;
    }

    if (bSign === aSign) return SignAttribute.POSITIVE;

    return SignAttribute.NEGATIVE;
});

multiple.partial = a => attributedFunction(b => a * b, {
    parity: pb => multiple.attrs.parity(new ParityAttribute(a).value, pb),
    sign: sb => multiple.attrs.sign(new SignAttribute(a).value, sb)
});

pair = attributedFunction((a, b) => [a, b], {
    parity: (a, b) => [a, b],
    sign: (a, b) => [a, b]
});

module.exports = {
    plus,
    multiple,
    pair
};
