function attributeMapper(AC) {
    return this.attrs[AC.attrName];
}

function f(f, attrs) {
    f.attrs = attrs;
    f.attributed = true;
    f.attributeMapper = attributeMapper;
    return f;
}

module.exports = { f };
