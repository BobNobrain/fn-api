export default class Attribute<V> {
    public static readonly attrName: string = '';

    constructor(
        public value: V | void
    ) {}

    change(newValue: V | void): Attribute<V> {
        this.value = newValue;
        return this;
    }

    indeterminate(): Attribute<V> {
        this.value = void 0;
        return this;
    }

    map(f: { (attrValue: V): V | void }): Attribute<V> {
        if (f === undefined) return this.indeterminate();
        if (this.value !== undefined) {
            this.value = f(this.value as V);
        }
        return this;
    }
}
