import { Router } from "express";
import { getUser, editUserData} from "../controllers/user.controller.js";
import authorization from "../middleware/authorization.js";

const router = Router();

router.get('/user', authorization, getUser)
router.put('/edit-user', authorization, editUserData)

export default router;