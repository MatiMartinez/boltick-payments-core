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
exports.MercadoPagoService = void 0;
const mercadopago_1 = require("mercadopago");
class MercadoPagoService {
    constructor() {
        this.client = new mercadopago_1.MercadoPagoConfig({
            accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
        });
        this.preference = new mercadopago_1.Preference(this.client);
        this.createPayment = (payload) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.preference.create({
                body: payload,
            });
            if (response.api_response.status !== 201 || !(response === null || response === void 0 ? void 0 : response.init_point)) {
                console.log('Error al generar link de pago.', response);
                throw new Error();
            }
            return {
                url: response.init_point,
            };
        });
    }
}
exports.MercadoPagoService = MercadoPagoService;
