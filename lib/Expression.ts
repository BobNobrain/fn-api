export type Predicate<T> = { (T): Boolean };
export type Mapper<T, U> = { (T): U };

export interface Evaluable<T> {
    evalAsync(): Promise<T>;
}

export class CommonExpression<T> implements Evaluable<T[]> {
    if(condition: Predicate<T[]>): IfExpression<T> {
        return new IfExpression(this, condition);
    }
    then<U>(m: Mapper<T[], U[]>): CommonExpression<U> {
        return new ChainedExpression(this, m);
    }
    every<U>(...ms: Mapper<T, U>[]): CommonExpression<U> {
        return new MultiplierExpression(this, ms);
    }

    evalAsync(): Promise<T[]> {
        return Promise.reject(new TypeError('Abstract method CommonExpression::evalAsync called!'));
    }
}

export class IfExpression<T> {
    constructor(
        private source: Evaluable<T[]>,
        private condition: Predicate<T[]>
    ) {
    }

    public then<U>(m: Mapper<T, U>): ThenExpression<T, U> {
        return new ThenExpression(this.source, this.condition, m);
    }
}

export class ThenExpression<T, U> {
    constructor(
        private source: Evaluable<T[]>,
        private condition: Predicate<T[]>,
        private mapper: Mapper<T[], U[]>
    ) {
    }

    public else(m: Mapper<T, U>): ElseExpression<T, U> {
        return new ElseExpression(this.source, this.condition, this.mapper, m);
    }
}

export class ElseExpression<T, U> extends CommonExpression<U> {
    constructor(
        private source: Evaluable<T>,
        private condition: Predicate<T[]>,
        private thenMapper: Mapper<T[], U[]>,
        private elseMapper: Mapper<T[], U[]>
    ) {
        super();
    }

    public evalAsync(): Promise<U[]> {
        return this.source.evalAsync()
            .then(source => {
                if (this.condition(source)) {
                    return this.thenMapper(source);
                } else {
                    return this.elseMapper(source);
                }
            });
    }
}

export class ChainedExpression<T, U> extends CommonExpression<U> {
    constructor(
        private parent: Evaluable<T[]>,
        private m: Mapper<T[], U[]>
    ) {
        super();
    }

    evalAsync() {
        return this.parent.evalAsync()
            .then(t => this.m(t));
    }
}

export class MultiplierExpression<T, U> extends CommonExpression<U[]> {
    constructor(
        private source: CommonExpression<T>,
        private ms: Mapper<T[], U[]>[]
    ) {
        super();
    }

    evalAsync() {
        return this.source.evalAsync()
            .then(
                t => this.ms.map(fn => fn(t))
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
