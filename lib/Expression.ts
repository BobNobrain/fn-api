type Predicate<T> = { (...ts: T[]): Boolean };
type DirectPredicate<T> = { (T): Boolean };

type Mapper<T, U> = { (...ts: T[]): U[] };
type SubMapper<T, U> = { (...ts: T[]): U };
type DirectMapper<T, U> = { (T): U };

type Folder<T, U> = { (U, T): U };
type Zipper<T, U, V> = { (T, U): V };

interface Evaluable<T> {
    evalAsync(): Promise<T[]>;
}

export class CommonExpression<T> implements Evaluable<T> {
    if(condition: Predicate<T>): IfExpression<T> {
        return new IfExpression(this, condition);
    }

    then<U>(m: Mapper<T, U>): CommonExpression<U> {
        return new ChainedExpression(this, m);
    }

    shrink<U>(m: SubMapper<T, U>): CommonExpression<U> {
        return new ChainedExpression(
            this,
            (...ts: T[]) => [m(...ts)]
        );
    }

    every<U>(...ms: SubMapper<T, U>[]): CommonExpression<U> {
        return new MultiplierExpression(this, ms);
    }

    join(...values: T[]): CommonExpression<T> {
        return new JoinExpression(this, values);
    }

    map<U>(fn: DirectMapper<T, U>): CommonExpression<U> {
        return new MapExpression(this, fn);
    }

    filter(fn: DirectPredicate<T>): CommonExpression<T> {
        return new FilterExpression(this, fn);
    }

    flatMap<U>(fn: DirectMapper<T, U[]>): CommonExpression<U> {
        return new FlatMapExpression(this, fn);
    }

    zip<U>(expr: CommonExpression<U>): CommonExpression<{0: T, 1: U}> {
        return new ZipExpression(
            this,
            expr,
            (t: T, u: U) => ({0: t, 1: u, length: 2})
        );
    }
    zipWith<U, V>(fn: Zipper<T, U, V>, expr: CommonExpression<U>): CommonExpression<V> {
        return new ZipExpression(this, expr, fn);
    }
    zipValues<U>(...values: U[]): CommonExpression<{0: T, 1: U}> {
        return new ZipExpression(
            this,
            new ValuesExpression<U>(values),
            (t: T, u: U) => ({0: t, 1: u, length: 2})
        );
    }
    zipValuesWith<U, V>(fn: Zipper<T, U, V>, ...values: U[]): CommonExpression<V> {
        return new ZipExpression(
            this,
            new ValuesExpression<U>(values),
            fn
        );
    }

    fold<U>(fn: Folder<T, U>, initialValue: U): CommonExpression<U> {
        return new FoldExpression(this, fn, initialValue);
    }

    evalAsync(): Promise<T[]> {
        return Promise.reject(new TypeError('Abstract method CommonExpression::evalAsync called!'));
    }

    evalFirstAsync(): Promise<T> {
        return this.evalAsync().then(([t]) => t);
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

class IfExpression<T> {
    constructor(
        private source: Evaluable<T>,
        private condition: Predicate<T>
    ) {
    }

    public then<U>(m: Mapper<T, U>): ThenExpression<T, U> {
        return new ThenExpression(this.source, this.condition, m);
    }
}

class ThenExpression<T, U> {
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

class ElseExpression<T, U> extends CommonExpression<U> {
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

class ChainedExpression<T, U> extends CommonExpression<U> {
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

class MultiplierExpression<T, U> extends CommonExpression<U> {
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

class JoinExpression<T> extends CommonExpression<T> {
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

class MapExpression<T, U> extends CommonExpression<U> {
    constructor(
        private source: CommonExpression<T>,
        private fn: DirectMapper<T, U>
    ) {
        super();
    }

    evalAsync() {
        return this.source.evalAsync()
            .then(ts => ts.map(this.fn));
    }
}

class FilterExpression<T> extends CommonExpression<T> {
    constructor(
        private source: CommonExpression<T>,
        private fn: DirectPredicate<T>
    ) {
        super();
    }

    evalAsync() {
        return this.source.evalAsync()
            .then(ts => ts.filter(this.fn));
    }
}

class FlatMapExpression<T, U> extends CommonExpression<U> {
    constructor(
        private source: CommonExpression<T>,
        private fn: DirectMapper<T, U[]>
    ) {
        super();
    }

    evalAsync() {
        return this.source.evalAsync()
            .then(
                ts => ts.reduce(
                    (acc, t) => acc.concat(this.fn(t)),
                    []
                )
            );
    }
}

class FoldExpression<T, U> extends CommonExpression<U> {
    constructor(
        private source: CommonExpression<T>,
        private fn: Folder<T, U>,
        private u0: U
    ) {
        super();
    }

    evalAsync(): Promise<U[]> {
        return this.source.evalAsync()
            .then(ts => ts.reduce(this.fn, this.u0));
    }
}

class ZipExpression<T, U, V> extends CommonExpression<V> {
    constructor(
        private source: CommonExpression<T>,
        private values: CommonExpression<U>,
        private fn: Zipper<T, U, V>
    ) {
        super();
    }

    evalAsync() {
        return Promise.all([
            this.source.evalAsync(),
            this.values.evalAsync()
        ])
            .then(([ts, us]) => {
                const fn = this.fn;
                const l = Math.min(us.length, ts.length);
                const vs: V[] = new Array(l);

                for (let i = 0; i < l; i++) {
                    vs[i] = fn(ts[i], vs[i]);
                }
                return vs;
            });
    }
}
