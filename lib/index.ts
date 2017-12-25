import {
    ValuesExpression,
    CommonExpression
} from './Expression';

export function values<T>(...values: T[]): CommonExpression<T> {
    return new ValuesExpression(values);
}
