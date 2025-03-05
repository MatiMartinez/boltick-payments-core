import express from 'express';
import { paymentRoutes } from '@routes/Payment';
import { ticketRoutes } from '@routes/Tickets';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/payments', paymentRoutes);
app.use('/api/tickets', ticketRoutes);

export { app };
