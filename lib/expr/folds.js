const CommonExpression = require('./common');

class MapExpression extends CommonExpression {
    constructor(source, fn) {
        super();
        this.source = source;
        this.fn = fn;
    }

    async evalAsync() {
        const ts = await this.source.evalAsync()
        return ts.map(this.fn);
    }

    deriveAttributes(AC) {
        return this.source.deriveAttributes(AC).map(
            attr => attr.map(this.fn.attrs[AC.attrName])
        );
    }
}

class FilterExpression extends CommonExpression {
    constructor(source, fn) {
        super();
        this.source = source;
        this.fn = fn;
    }

    async evalAsync() {
        const ts = await this.source.evalAsync()
        return ts.filter(this.fn);
    }

    deriveAttributes(AC) {
        return this.source.deriveAttributes(AC).filter(
            this.fn.attributeMapper(AC)
        )
    }
}

class FoldExpression extends CommonExpression {
    constructor(source, fn, start) {
        super();
        this.source = source;
        this.fn = fn;
        this.start = start;
    }

    async evalAsync() {
        const ts = await this.source.evalAsync()
        return [ts.reduce(this.fn, this.start)];
    }

    deriveAttributes(AC) {
        const attributeMapper = this.fn.attributeMapper(AC)
        return [this.source.deriveAttributes(AC).reduce(
            (acc, next) => new AC(attributeMapper(acc.value, next.value)),
            new AC(this.start)
        )];
    }
}

CommonExpression.prototype.map = function (fn) {
    return new MapExpression(this, fn);
}

CommonExpression.prototype.filter = function (fn) {
    return new FilterExpression(this, fn);
}

CommonExpression.prototype.fold = function (fn, initialValue) {
    return new FoldExpression(this, fn, initialValue);
}

module.exports = {
    MapExpression,
    FilterExpression,
    FoldExpression
};
