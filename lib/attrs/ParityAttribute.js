const Attribute = require('./Attribute');

class ParityAttribute extends Attribute {
    constructor(value) {
        let v = void 0;
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

module.exports = ParityAttribute;
