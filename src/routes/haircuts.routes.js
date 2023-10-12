import { Router } from "express";
import { getAllHaircuts, createHaircut, deleteHaircut, getHaircut, updateHaircut } from "../controllers/haircut.controller.js";

const router = Router();

router.get('/haircut', getAllHaircuts)

router.get('/haircut/:id', getHaircut)

router.post('/haircut', createHaircut)

router.delete('/haircut/:id', deleteHaircut)

router.put('/haircut/:id', updateHaircut)

export default router;