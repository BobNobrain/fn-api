export type Predicate<T> = { (...ts: T[]): Boolean };
export type Mapper<T, U> = { (...ts: T[]): U[] };
export type SubMapper<T, U> = { (...ts: T[]): U };

export interface Evaluable<T> {
    evalAsync(): Promise<T[]>;
}

export class CommonExpression<T> implements Evaluable<T> {
    if(condition: Predicate<T>): IfExpression<T> {
        return new IfExpression(this, condition);
    }
    then<U>(m: Mapper<T, U>): CommonExpression<U> {
        return new ChainedExpression(this, m);
    }
    every<U>(...ms: SubMapper<T, U>[]): CommonExpression<U> {
        return new MultiplierExpression(this, ms);
    }

    evalAsync(): Promise<T[]> {
        return Promise.reject(new TypeError('Abstract method CommonExpression::evalAsync called!'));
    }
}

export class IfExpression<T> {
    constructor(
        private source: Evaluable<T>,
        private condition: Predicate<T>
    ) {
    }

    public then<U>(m: Mapper<T, U>): ThenExpression<T, U> {
        return new ThenExpression(this.source, this.condition, m);
    }
}

export class ThenExpression<T, U> {
    constructor(
        private source: Evaluable<T>,
        private condition: Predicate<T>,
        private mapper: Mapper<T, U>
    ) {
    }

    public else(m: Mapper<T, U>): ElseExpression<T, U> {
        return new ElseExpression(this.source, this.condition, this.mapper, m);
    }
}

export class ElseExpression<T, U> extends CommonExpression<U> {
    constructor(
        private source: Evaluable<T>,
        private condition: Predicate<T>,
        private thenMapper: Mapper<T, U>,
        private elseMapper: Mapper<T, U>
    ) {
        super();
    }

    public evalAsync(): Promise<U[]> {
        return this.source.evalAsync()
            .then(ts => {
                if (this.condition(...ts)) {
                    return this.thenMapper(...ts);
                } else {
                    return this.elseMapper(...ts);
                }
            });
    }
}

export class ChainedExpression<T, U> extends CommonExpression<U> {
    constructor(
        private parent: Evaluable<T>,
        private m: Mapper<T, U>
    ) {
        super();
    }

    evalAsync() {
        return this.parent.evalAsync()
            .then(ts => this.m(...ts));
    }
}

export class MultiplierExpression<T, U> extends CommonExpression<U> {
    constructor(
        private source: CommonExpression<T>,
        private ms: SubMapper<T, U>[]
    ) {
        super();
    }

    evalAsync() {
        return this.source.evalAsync()
            .then(
                ts => this.ms.map(fn => fn(...ts))
            );
    }
}

export class ValuesExpression<T> extends CommonExpression<T> {
    constructor(private values: T[]) {
        super();
    }

    public evalAsync(): Promise<T[]> {
        return Promise.resolve(this.values);
    }
}

export class JoinExpression<T> extends CommonExpression<T> {
    constructor(
        private source: CommonExpression<T>,
        private values: T[]
    ) {
        super();
    }

    evalAsync() {
        return this.source.evalAsync()
            .then(arr => arr.concat(this.values));
    }
}
