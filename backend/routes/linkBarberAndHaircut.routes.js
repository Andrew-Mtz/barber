import { Router } from "express";
import { getBarbersAndHaircuts, getLinkedHaircuts, associateHaircutsWithBarber } from "../controllers/linkBarberAndHaircut.controller.js";
import authorization from "../middleware/authorization.js";

const router = Router();

router.get('/barbersAndHaircuts', authorization, getBarbersAndHaircuts);
router.get('/linkedHaircuts', authorization, getLinkedHaircuts);
router.post('/associateHaircutsWithBarber', authorization, associateHaircutsWithBarber);

export default router;