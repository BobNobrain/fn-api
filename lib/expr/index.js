// register subclasses
require('./chains');
require('./condition');
require('./folds');
require('./join');
require('./multiply');
require('./zip');

const { ValuesExpression } = require('./values');

module.exports = {
    values(...vals) {
        return new ValuesExpression(vals);
    }
};
