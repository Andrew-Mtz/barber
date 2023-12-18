import { Router } from "express";
import { getAllHaircuts, createHaircut, deleteHaircut, getHaircut, updateHaircut, getHaircutByBarber } from "../controllers/haircut.controller.js";

const router = Router();

router.get('/haircut', getAllHaircuts)

router.get('/haircut/:id', getHaircut)

router.get('/haircut-by-barber', getHaircutByBarber)

router.post('/haircut', createHaircut)

router.delete('/haircut/:id', deleteHaircut)

router.put('/haircut/:id', updateHaircut)

export default router;