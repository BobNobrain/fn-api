import {
    ValuesExpression,
    CommonExpression
} from './Expression';

export {
    f
} from './Function';

export function values<T>(...values: T[]): CommonExpression<T> {
    return new ValuesExpression(values);
}

export function value<T>(value: T): CommonExpression<T> {
    return new ValuesExpression([value]);
}
