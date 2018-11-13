class Attribute {
    constructor(value) {
        this.value = value;
    }

    change(newValue) {
        this.value = newValue;
        return this;
    }

    indeterminate() {
        this.value = void 0;
        return this;
    }

    map(f) {
        if (f === undefined) return this.indeterminate();
        if (this.value !== undefined) {
            this.value = f(this.value);
        }
        return this;
    }
}
Attribute.attrName = '';

module.exports = Attribute;
