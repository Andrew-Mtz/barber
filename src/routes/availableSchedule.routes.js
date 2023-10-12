import { Router } from "express";
import { getAllAvailablesSchedule, getAvailableSchedule, createAvailableSchedule, deleteAvailableSchedule, getDayByBarberAndDay } from "../controllers/availableSchedule.controller.js";

const router = Router();

router.get('/available-schedule', getAllAvailablesSchedule)

router.get('/available-schedule/:id', getAvailableSchedule)

router.post('/available-schedule', createAvailableSchedule)

router.delete('/available-schedule/:id', deleteAvailableSchedule)

router.get('/available-schedule-by-date', getDayByBarberAndDay)

export default router;