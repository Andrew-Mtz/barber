import { Router } from "express";
import { getAllBookings, getBooking, getLastsBooking, createBooking, updateBooking, canceleBooking } from "../controllers/booking.controller.js";
import authorization from "../middleware/authorization.js";

const router = Router();

router.get('/booking', getAllBookings)

router.get('/my-booking', authorization, getBooking)

router.get('/my-lasts-booking', authorization, getLastsBooking)

router.post('/booking', authorization, createBooking)

router.delete('/booking/:id', authorization, canceleBooking)

router.put('/booking/:id', updateBooking)

export default router;