class CommonExpression {
    evalAsync() {
        return Promise.reject(new TypeError('Abstract method CommonExpression::evalAsync called!'));
    }

    async evalFirstAsync() {
        const [t] = await this.evalAsync();
        return t;
    }

    deriveAttributes(AC) {
        throw new TypeError('Abstract method CommonExpression::deriveAttribute called!');
    }
}

module.exports = CommonExpression;
