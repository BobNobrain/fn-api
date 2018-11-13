const Attribute = require('./Attribute');

class ParityAttribute extends Attribute {
    constructor(value) {
        let v = Attribute.INDETERMINATE;
        if (typeof value === typeof 0) v = (value % 2);
        super(v);
    }

    toString() {
        let p = 'INDETERMINATE';
        if (typeof this.value === typeof 0) {
            p = ['EVEN', 'ODD'][this.value];
        }
        return 'ParityAttribute.' + p;
    }
}
ParityAttribute.attrName = 'parity';

ParityAttribute.EVEN = 0;
ParityAttribute.ODD = 1;

module.exports = ParityAttribute;
