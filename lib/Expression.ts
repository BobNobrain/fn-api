export class Expression {
    constructor(public parent: Expression = null) {
    }

    public static value<T>(value: T): ValueExpression<T> {
        return new ValueExpression(value);
    }
}

export class ValueExpression<T> extends Expression {
    constructor(private value: T) {
        super(null);
    }

    public evalAsync(): Promise<T> {
        return Promise.resolve(this.value);
    }
}
