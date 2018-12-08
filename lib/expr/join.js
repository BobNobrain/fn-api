const CommonExpression = require('./common');

class JoinExpression extends CommonExpression {
    constructor(source, values) {
        super();
        this.source = source;
        this.values = values;
    }

    async evalAsync() {
        const arr = await this.source.evalAsync();
        return arr.concat(this.values);
    }

    deriveAttributes(AC) {
        return this.source.deriveAttributes(AC).concat(
            this.values.map(v => new AC(v))
        )
    }
}

CommonExpression.prototype.join = function (...values) {
    return new JoinExpression(this, values);
}

module.exports = {
    JoinExpression
};
