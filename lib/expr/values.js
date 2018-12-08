const CommonExpression = require('./common');

class ValuesExpression extends CommonExpression {
    constructor(values) {
        super();
        this.values = values;
    }

    evalAsync() {
        return Promise.resolve(this.values);
    }

    deriveAttributes(AC) {
        return this.values.map(v => new AC(v));
    }
}

module.exports = {
    ValuesExpression
};
