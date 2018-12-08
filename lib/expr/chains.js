const CommonExpression = require('./common');

class ChainedExpression extends CommonExpression {
    constructor(parent, m) {
        super();
        this.parent = parent;
        this.m = m;
    }

    async evalAsync() {
        const ts = await this.parent.evalAsync()
        return this.m(...ts);
    }

    deriveAttributes(AC) {
        const attrs = this.parent.deriveAttributes(AC);
        return this.m.attributeMapper(AC);
    }
}

CommonExpression.prototype.then = function (m) {
    return new ChainedExpression(this, m);
}

CommonExpression.prototype.shrink = function (m) {
    return new ChainedExpression(
        this,
        (...ts) => [m(...ts)]
    );
}

module.exports = {
    ChainedExpression
};
