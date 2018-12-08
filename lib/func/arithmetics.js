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

const multiply = attributedFunction((a, b) => a * b);

ParityAttribute.defineFor(multiply, (aParity, bParity) => {
    if (bParity === ParityAttribute.EVEN) return bParity;
    if (aParity === ParityAttribute.EVEN) return aParity;

    if (bParity === ParityAttribute.ODD && aParity === ParityAttribute.ODD)
        return ParityAttribute.ODD;

    return ParityAttribute.INDETERMINATE;
});

SignAttribute.defineFor(multiply, (aSign, bSign) => {
    if (bSign === SignAttribute.ZERO) return SignAttribute.ZERO;
    if (aSign === SignAttribute.ZERO) return SignAttribute.ZERO;

    if (bSign === SignAttribute.INDETERMINATE || aSign === SignAttribute.INDETERMINATE) {
        return SignAttribute.INDETERMINATE;
    }

    if (bSign === aSign) return SignAttribute.POSITIVE;

    return SignAttribute.NEGATIVE;
});

multiply.partial = a => attributedFunction(b => a * b, {
    parity: pb => multiply.attrs.parity(new ParityAttribute(a).value, pb),
    sign: sb => multiply.attrs.sign(new SignAttribute(a).value, sb)
});

pair = attributedFunction((a, b) => [a, b], {
    parity: (a, b) => [a, b],
    sign: (a, b) => [a, b]
});

module.exports = {
    plus,
    multiply,
    pair
};
