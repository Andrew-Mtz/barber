import { Router } from "express";
import { scheduleByBarber, createSchedule, getUnavailableDates, disableDay, enableDay } from "../controllers/schedule.controller.js";
import authorization from "../middleware/authorization.js";

const router = Router();

router.get('/schedule-by-barber', authorization, scheduleByBarber)

router.post('/schedule', createSchedule)

router.get('/unavailable-dates-by-barber', getUnavailableDates)

router.put('/disable-day/:id', disableDay)

router.put('/enable-day/:id', enableDay)

export default router;