class Attribute {
    constructor(value) {
        this.value = value;
    }

    indeterminate() {
        return this.copy(Attribute.INDETERMINATE);
    }

    map(f) {
        if (f === void 0) return this.indeterminate();
        return this.copy(f(this.value));
    }

    copy(...args) {
        const value = args.length ? args[0] : this.value;
        const Subclass = this.constructor;
        return new Subclass(value);
    }
}
Attribute.attrName = '';
Attribute.INDETERMINATE = void 0;

module.exports = Attribute;
