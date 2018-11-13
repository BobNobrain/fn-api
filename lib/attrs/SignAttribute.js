const Attribute = require('./Attribute');

class SignAttribute extends Attribute {
    constructor(value) {
        let v = undefined;
        if (typeof value === typeof 0) {
            v = Math.sign(value);
        }
        super(v);
    }

    toString() {
        let p = 'INDETERMINATE';
        if (typeof this.value === typeof 0) {
            p = ['NEGATIVE', 'ZERO', 'POSITIVE'][this.value + 1];
        }
        return 'SignAttribute.' + p;
    }
}
SignAttribute.attrName = 'sign';

module.exports = SignAttribute;
