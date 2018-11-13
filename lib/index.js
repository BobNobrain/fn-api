const {
    ValuesExpression,
    CommonExpression
} = require('./Expression');

const {
    f
} = require('./Function');

function values(...values) {
    return new ValuesExpression(values);
}

module.exports = {
    values,
    f
};
