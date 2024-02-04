"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentDynamoRepository = void 0;
const dynamodb_1 = require("../utils/dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
class PaymentDynamoRepository {
    constructor(dynamoClient) {
        this.dynamoClient = dynamoClient;
        this.createPayment = (payload) => __awaiter(this, void 0, void 0, function* () {
            const { id } = payload, rest = __rest(payload, ["id"]);
            const { updateExpression, expressionAttributeValues, expressionAttributeNames } = (0, dynamodb_1.createUpdateExpressions)(rest);
            const response = yield this.dynamoClient.send(new client_dynamodb_1.UpdateItemCommand({
                TableName: 'PAYMENTS',
                Key: { id: { S: id } },
                UpdateExpression: `SET ${updateExpression.join(', ')}`,
                ExpressionAttributeValues: expressionAttributeValues,
                ExpressionAttributeNames: expressionAttributeNames,
                ReturnValues: 'ALL_NEW',
            }));
            return response.Attributes;
        });
    }
}
exports.PaymentDynamoRepository = PaymentDynamoRepository;
