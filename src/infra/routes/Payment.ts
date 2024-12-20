import express from 'express';

import { Container } from '@containers/Container';

const paymentRoutes = express.Router();

const paymentController = Container.getInstance().getPaymentController();

paymentRoutes.post('/create-payment-link', (req, res) => paymentController.CreatePayment(req, res));
paymentRoutes.post('/update-payment-callback', (req, res) => paymentController.UpdatePayment(req, res));

export { paymentRoutes };
