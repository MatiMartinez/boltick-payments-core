import express from 'express';

import { Container } from '@containers/Container';

const ticketRoutes = express.Router();

const TicketController = Container.getInstance().getTicketController();

ticketRoutes.get('/get-tickets/:id', (req, res) => TicketController.GetTickets(req, res));

export { ticketRoutes };
