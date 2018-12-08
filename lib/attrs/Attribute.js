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

    static defineFor(fn, implementation) {
        if (!fn.attributed) throw new TypeError('fn is not attributed!');

        fn.attrs[this.attrName] = implementation;
    }
}
Attribute.attrName = '';
Attribute.INDETERMINATE = void 0;

module.exports = Attribute;
