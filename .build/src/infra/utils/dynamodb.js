"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUpdateExpressions = void 0;
const createUpdateExpressions = (item) => {
    const updateExpression = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};
    const formatValue = (value) => {
        if (typeof value === 'string') {
            return { S: value };
        }
        else if (typeof value === 'number') {
            return { N: value.toString() };
        }
        else if (typeof value === 'boolean') {
            return { BOOL: value };
        }
        else if (Array.isArray(value)) {
            return { L: value.map((v) => formatValue(v)) };
        }
        else if (typeof value === 'object' && value !== null) {
            const formattedObject = {};
            Object.keys(value).forEach((key) => {
                formattedObject[key] = formatValue(value[key]);
            });
            return { M: formattedObject };
        }
        else {
            throw new Error(`Unsupported type for value: ${value}`);
        }
    };
    Object.keys(item).forEach((key) => {
        const placeholder = `:${key}`;
        const alias = `#${key}`;
        updateExpression.push(`${alias} = ${placeholder}`);
        expressionAttributeValues[placeholder] = formatValue(item[key]);
        expressionAttributeNames[alias] = key;
    });
    return { updateExpression, expressionAttributeValues, expressionAttributeNames };
};
exports.createUpdateExpressions = createUpdateExpressions;
