import Attribute from './Attribute';

export type Parity = 0 | 1;

export class ParityAttribute extends Attribute<Parity> {
    public static readonly attrName = 'parity';

    constructor(value: any) {
        let v: Parity | void = undefined;
        if (typeof value === typeof 0) v = (value % 2) as Parity;
        super(v);
    }

    toString() {
        let p = 'INDETERMINATE';
        if (typeof this.value === typeof 0) {
            p = ['EVEN', 'ODD'][this.value as number];
        }
        return 'ParityAttribute.' + p;
    }
}
