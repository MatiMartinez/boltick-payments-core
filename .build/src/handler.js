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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const payment_vo_1 = require("./domain/payment.vo");
const mercadopago_service_1 = require("./infra/services/mercadopago/mercadopago.service");
const payment_dynamo_repository_1 = require("./infra/repository/payment.dynamo.repository");
const handler = (event, _context, callback) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (((_b = (_a = event === null || event === void 0 ? void 0 : event.requestContext) === null || _a === void 0 ? void 0 : _a.http) === null || _b === void 0 ? void 0 : _b.method) === 'OPTIONS') {
            callback(null, {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
                body: null,
            });
            return;
        }
        console.log('Ingresa el siguiente payload: ', JSON.stringify(event.body, null, 2));
        // console.log('Ingresa el siguiente payload: ', JSON.stringify(event.detail));
        const payload = JSON.parse(event.body);
        // const payload = event.detail
        const dynamoClient = new client_dynamodb_1.DynamoDBClient({
            // credentials: {
            //   accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
            //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
            // },
            region: 'us-east-1',
        });
        const new_payment = new payment_vo_1.PaymentVO().create(payload);
        const paymentRepository = new payment_dynamo_repository_1.PaymentDynamoRepository(dynamoClient);
        const new_payment_db = yield paymentRepository.createPayment(new_payment);
        console.log('Se creo el siguiente pago en DynamoDB: ', JSON.stringify(new_payment_db, null, 2));
        if (!new_payment_db)
            throw new Error('Error saving payment in DB.');
        const mercadopago_preference = new payment_vo_1.PaymentVO().createMercadopagoPreference(new_payment);
        const mercadoPagoService = new mercadopago_service_1.MercadoPagoService();
        const preference_response = yield mercadoPagoService.createPayment(mercadopago_preference);
        console.log('Se creo el siguiente link de Mercadopago: ', JSON.stringify(preference_response, null, 2));
        callback(null, {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            body: JSON.stringify(preference_response),
        });
    }
    catch (error) {
        console.log('Ocurrio un error general: ', JSON.stringify(error, null, 2));
        callback(null, {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            body: JSON.stringify(error),
        });
    }
});
exports.handler = handler;
