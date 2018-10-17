import Attribute from './attrs/Attribute';

interface Mapper<A, R> {
    (value: A): R
}

interface AttributeChangesDescriptor {
    [name: string]: {
        (attrValue: any): any
    }
}

export interface AttributedMapper<A, R> extends Mapper<A, R> {
    attrs: AttributeChangesDescriptor
}

export function f<A, R>(f: Mapper<A, R>, attrs: AttributeChangesDescriptor): AttributedMapper<A, R> {
    const fa = f as AttributedMapper<A, R>;
    fa.attrs = attrs;
    return fa;
}
