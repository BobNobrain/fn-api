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
}

CommonExpression.prototype.every = function (...ms) {
    return new MultiplierExpression(this, ms);
}
