import { Router } from "express";
import { getAllBarbers, getBarber, createBarber, deleteBarber, updateBarber } from "../controllers/barber.controller.js";

const router = Router();

router.get('/barber', getAllBarbers)

router.get('/barber/:id', getBarber)

router.post('/barber', createBarber)

router.delete('/barber/:id', deleteBarber)

router.put('/barber/:id', updateBarber)

export default router;