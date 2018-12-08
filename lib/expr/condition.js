const CommonExpression = require('./common');

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
            return ts.map(this.thenMapper);
        } else {
            return ts.map(this.elseMapper);
        }
    }

    deriveAttributes(AC) {
        return this.source.deriveAttributes(AC).map(attrValue => {
            const thenValue = attrValue.map(this.thenMapper.attributeMapper(AC));
            const elseValue = attrValue.map(this.elseMapper.attributeMapper(AC));
            if (thenValue.value === elseValue.value) return thenValue;
            return attrValue.indeterminate();
        });
    }
}

CommonExpression.prototype.if = function (condition) {
    return new IfExpression(this, condition);
};

module.exports = {
    IfExpression,
    ThenExpression,
    ElseExpression
};
