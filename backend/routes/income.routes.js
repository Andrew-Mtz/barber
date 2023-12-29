import { Router } from "express";
import { getBarberWorkDetail} from "../controllers/income.controller.js";
import authorization from "../middleware/authorization.js";

const router = Router();

router.get('/incomes', authorization, getBarberWorkDetail)

export default router;