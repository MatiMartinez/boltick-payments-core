import express from "express";
import { Container } from "@containers/Container";
import { web3AuthMiddleware } from "@middlewares/Web3AuthMiddleware";

const router = express.Router();

const PaymentController = Container.getInstance().getPaymentController();
const TicketController = Container.getInstance().getTicketController();
const EventController = Container.getInstance().getEventController();
const UserController = Container.getInstance().getUserController();

router.post("/payments/create-payment-link", web3AuthMiddleware, (req, res) => PaymentController.CreatePayment(req, res));
router.post("/payments/update-payment-callback", web3AuthMiddleware, (req, res) => PaymentController.UpdatePayment(req, res));
// router.post("/payments/create-free-payment", (req, res) => PaymentController.CreateFreePayment(req, res));

router.get("/tickets/get-tickets/:id", web3AuthMiddleware, (req, res) => TicketController.GetTickets(req, res));
router.get("/tickets/get-tickets-by-wallet/:id", web3AuthMiddleware, (req, res) => TicketController.GetTicketsByWallet(req, res));
router.post("/tickets/generate-entry", web3AuthMiddleware, (req, res) => TicketController.GenerateEntry(req, res));

router.get("/events", (req, res) => EventController.GetAllEvents(req, res));
router.get("/events/:id", (req, res) => EventController.GetEventById(req, res));

router.post("/users/register", web3AuthMiddleware, (req, res) => UserController.RegisterUser(req, res));

export { router };
