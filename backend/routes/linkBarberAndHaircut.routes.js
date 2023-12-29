import { Router } from "express";
import { getBarbersAndHaircuts, getLinkedHaircuts} from "../controllers/linkBarberAndHaircut.controller.js";
import authorization from "../middleware/authorization.js";

const router = Router();

router.get('/barbersAndHaircuts', authorization, getBarbersAndHaircuts)
router.get('/linkedHaircuts', authorization, getLinkedHaircuts)

export default router;