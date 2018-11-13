const { pair } = require('./fns');

class CommonExpression {
    if(condition) { return new IfExpression(this, condition); }

    then(m) { return new ChainedExpression(this, m); }

    shrink(m) {
        return new ChainedExpression(
            this,
            (...ts) => [m(...ts)]
        );
    }

    every(...ms) { return new MultiplierExpression(this, ms); }

    join(...values) { return new JoinExpression(this, values); }

    map(fn) { return new MapExpression(this, fn); }

    filter(fn) { return new FilterExpression(this, fn); }

    zip(expr) {
        return new ZipExpression(
            this,
            expr,
            pair
        );
    }
    zipWith(fn, expr) { return new ZipExpression(this, expr, fn); }
    zipValues(...values) {
        return new ZipExpression(
            this,
            new ValuesExpression(values),
            pair
        );
    }
    zipValuesWith(fn, ...values) {
        return new ZipExpression(
            this,
            new ValuesExpression(values),
            fn
        );
    }

    fold(fn, initialValue) { return new FoldExpression(this, fn, initialValue); }

    evalAsync() {
        return Promise.reject(new TypeError('Abstract method CommonExpression::evalAsync called!'));
    }

    async evalFirstAsync() {
        const [t] = await this.evalAsync();
        return t;
    }

    deriveAttributes(AC) {
        throw new TypeError('Abstract method CommonExpression::deriveAttribute called!');
    }
}

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

class IfExpression {
    constructor(source, condition) {
        this.source = source;
        this.condition = condition;
    }

    then(m) {
        return new ThenExpression(this.source, this.condition, m);
    }
}

class ThenExpression {
    constructor(source, condition, mapper) {
        this.source = source;
        this.condition = condition;
        this.mapper = mapper;
    }

    else(m) {
        return new ElseExpression(this.source, this.condition, this.mapper, m);
    }
}

class ElseExpression extends CommonExpression {
    constructor(source, condition, thenMapper, elseMapper) {
        super();
        this.source = source;
        this.condition = condition;
        this.thenMapper = thenMapper;
        this.elseMapper = elseMapper;
    }

    async evalAsync() {
        const ts = await this.source.evalAsync();
        if (this.condition(...ts)) {
            return this.thenMapper(...ts);
        } else {
            return this.elseMapper(...ts);
        }
    }

    deriveAttributes(AC) {
        return this.source.deriveAttributes(AC).map(attrValue => {
            const thenValue = attrValue.map(this.thenMapper.attributeMapper(AC));
            const elseValue = attrValue.map(this.elseMapper.attributeMapper(AC));
            console.log(thenValue, elseValue, attrValue);
            if (thenValue.value === elseValue.value) return thenValue;
            return attrValue.indeterminate();
        });
    }
}

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
}

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

class ZipExpression extends CommonExpression {
    constructor(source, values, fn) {
        super();
        this.source = source;
        this.values = values;
        this.fn = fn;
    }

    async evalAsync() {
        const [ts, us] = Promise.all([
            this.source.evalAsync(),
            this.values.evalAsync()
        ])
        const fn = this.fn;
        const l = Math.min(us.length, ts.length);
        const vs = new Array(l);

        for (let i = 0; i < l; i++) {
            vs[i] = fn(ts[i], vs[i]);
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

module.exports = {
    ValuesExpression
};
