const Attribute = require('../attrs/Attribute');

const attributedFunctionProto = {
    attributeMapper(AC) {
        return this.attrs[AC.attrName];
    },

    attributed: true,

    attribute(name, deriver) {
        if (name.prototype instanceof Attribute) name = name.attrName;
        this.attrs[name] = deriver;
    }
};

function f(f, attrs = {}) {
    f.attrs = attrs;
    Object.assign(f, attributedFunctionProto);
    return f;
}

module.exports = f;
