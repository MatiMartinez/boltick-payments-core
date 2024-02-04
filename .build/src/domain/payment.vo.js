"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentVO = void 0;
const uuid_1 = require("uuid");
class PaymentVO {
    constructor() {
        this.create = (payload) => {
            return Object.assign(Object.assign({}, payload), { createdAt: new Date().getTime(), id: this.generateId('PS'), provider: 'Mercado Pago', items: payload.items, status: 'Pending' });
        };
        this.createMercadopagoPreference = (payload) => {
            const { id, items, user } = payload;
            const APP_URL = process.env.APP_URL;
            const precio_total = items.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);
            return {
                back_urls: {
                    failure: `${APP_URL}/payment-callback-failure?external_reference=${id}`,
                    pending: `${APP_URL}/payment-callback-pending?external_reference=${id}`,
                    success: `${APP_URL}/payment-callback-success?external_reference=${id}`,
                },
                external_reference: id,
                items: [
                    {
                        id: (0, uuid_1.v4)(),
                        quantity: 1,
                        title: `Orden ${id}`,
                        unit_price: precio_total,
                    },
                ],
                payer: {
                    email: user,
                },
            };
        };
        this.generateId = (prefix) => {
            const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            const numbers = Math.floor(100000 + Math.random() * 900000);
            return `${prefix}${letter}${numbers}`;
        };
    }
}
exports.PaymentVO = PaymentVO;
