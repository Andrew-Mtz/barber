import { Router } from "express";
import { getAllAvailablesSchedule, getAvailableSchedule, getAllSchedules, getSchedulesByStatus, disableHour, enableHour } from "../controllers/availableSchedule.controller.js";

const router = Router();

router.get('/available-schedule', getAllAvailablesSchedule)

router.get('/available-schedule/:id', getAvailableSchedule)

router.get('/all-schedules-by-date', getAllSchedules)

router.get('/diferents-schedules-by-date', getSchedulesByStatus)

router.put('/disable-hour', disableHour)

router.put('/enable-hour', enableHour)

export default router;