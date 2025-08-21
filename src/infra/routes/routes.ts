import express from "express";
import { Container } from "@containers/Container";

const router = express.Router();

const PaymentController = Container.getInstance().getPaymentController();
const TicketController = Container.getInstance().getTicketController();
const EventController = Container.getInstance().getEventController();

router.post("/payments/create-payment-link", (req, res) => PaymentController.CreatePayment(req, res));
router.post("/payments/update-payment-callback", (req, res) => PaymentController.UpdatePayment(req, res));
router.post("/payments/create-free-payment", (req, res) => PaymentController.CreateFreePayment(req, res));

router.get("/tickets/get-tickets/:id", (req, res) => TicketController.GetTickets(req, res));
router.get("/tickets/get-tickets-by-wallet/:id", (req, res) => TicketController.GetTicketsByWallet(req, res));
router.post("/tickets/generate-entry", (req, res) => TicketController.GenerateEntry(req, res));

router.get("/events", (req, res) => EventController.GetAllEvents(req, res));
router.get("/events/:id", (req, res) => EventController.GetEventById(req, res));

export { router };
