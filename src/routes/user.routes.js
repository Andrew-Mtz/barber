import { Router } from "express";
import { getUser} from "../controllers/user.controller.js";
import authorization from "../middleware/authorization.js";

const router = Router();

router.get('/user', authorization, getUser)

export default router;