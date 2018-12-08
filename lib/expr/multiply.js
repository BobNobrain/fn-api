const CommonExpression = require('./common');

class MultiplierExpression extends CommonExpression {
    constructor(source, ms) {
        super();
        this.source = source;
        this.ms = ms;
    }

    async evalAsync() {
        const ts = await this.source.evalAsync();
        return this.ms.map(fn => fn(...ts));
    }

    deriveAttributes(AC) {
        const attrs = this.source.deriveAttributes(AC);
        return this.ms.map(f => f.attributeMapper(AC)(...attrs));
    }
}

CommonExpression.prototype.every = function (...ms) {
    return new MultiplierExpression(this, ms);
}
