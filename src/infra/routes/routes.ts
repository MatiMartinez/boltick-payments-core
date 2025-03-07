import express from 'express';

import { Container } from '@containers/Container';

const router = express.Router();

const PaymentController = Container.getInstance().getPaymentController();
const TicketController = Container.getInstance().getTicketController();

router.post('/payments/create-payment-link', (req, res) => PaymentController.CreatePayment(req, res));
router.post('/payments/update-payment-callback', (req, res) => PaymentController.UpdatePayment(req, res));

router.get('/tickets/get-tickets/:id', (req, res) => TicketController.GetTickets(req, res));

export { router };
