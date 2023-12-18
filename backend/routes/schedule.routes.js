import { Router } from "express";
import { getAllSchedules, getSchedule, createSchedule, deleteSchedule } from "../controllers/schedule.controller.js";

const router = Router();

router.get('/schedule', getAllSchedules)

router.get('/schedule/:id', getSchedule)

router.post('/schedule', createSchedule)

router.delete('/schedule/:id', deleteSchedule)

export default router;