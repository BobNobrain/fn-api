import Attribute from './Attribute';

export type Sign = -1 | 0 | 1;

export class SignAttribute extends Attribute<Sign> {
    public static readonly attrName = 'sign';

    constructor(value: Sign) {
        let v: Sign | void = undefined;
        if (typeof value === typeof 0) {
            v = Math.sign(value) as Sign;
        }
        super(v);
    }

    toString() {
        let p = 'INDETERMINATE';
        if (typeof this.value === typeof 0) {
            p = ['NEGATIVE', 'ZERO', 'POSITIVE'][this.value as number + 1];
        }
        return 'SignAttribute.' + p;
    }
}
