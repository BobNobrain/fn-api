const CommonExpression = require('./common');
const { ValuesExpression } = require('./values');
const { pair } = require('../func/arithmetics');

class ZipExpression extends CommonExpression {
    constructor(source, values, fn) {
        super();
        this.source = source;
        this.values = values;
        this.fn = fn;
    }

    async evalAsync() {
        const [ts, us] = await Promise.all([
            this.source.evalAsync(),
            this.values.evalAsync()
        ]);
        const fn = this.fn;
        const l = Math.min(us.length, ts.length);
        const vs = new Array(l);

        for (let i = 0; i < l; i++) {
            vs[i] = fn(ts[i], us[i]);
        }
        return vs;
    }

    deriveAttributes(AC) {
        const attributeMapper = this.fn.attributeMapper(AC);
        const ts = this.source.deriveAttributes(AC);
        const us = this.values.deriveAttributes(AC);

        const l = Math.min(us.length, ts.length);
        const vs = new Array(l);
        for (let i = 0; i < l; i++) {
            vs[i] = new AC(attributeMapper(ts[i].value, us[i].value));
        }
        return vs;
    }
}

CommonExpression.prototype.zip = function (expr) {
    return new ZipExpression(
        this,
        expr,
        pair
    );
}
CommonExpression.prototype.zipWith = function (fn, expr) { return new ZipExpression(this, expr, fn); }
CommonExpression.prototype.zipValues = function (...values) {
    return new ZipExpression(
        this,
        new ValuesExpression(values),
        pair
    );
}
CommonExpression.prototype.zipValuesWith = function (fn, ...values) {
    return new ZipExpression(
        this,
        new ValuesExpression(values),
        fn
    );
}
