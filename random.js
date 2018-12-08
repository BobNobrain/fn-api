const axios = require('axios');
const CommonExpression = require('./lib/expr/common');

/**
 * @class Represents expression that contains n random values
 * obtained from random.org
 * @field {Number} n Number of random values
 */
class RandomOrgValues extends CommonExpression {
    constructor(n, min = 0, max = 100) {
        super();
        this.n = n;
        this.min = min;
        this.max = max;
    }

    async evalAsync() {
        const response = await axios.get(
            `https://www.random.org/integers/?num=${this.n}&min=${this.min}&max=${this.max}&col=1&base=10&format=plain&rnd=new`
        );
        return response.data.split('\n').map(n => +n);
    }

    deriveAttributes(AC) {
        return new Array(this.n).fill(null).map(_ => new AC(void 0));
    }
}

module.exports = (...args) => new RandomOrgValues(...args);
