import { Router } from "express";
import { signIn, signUp, isVerify } from "../controllers/jwtAuth.controller.js";
import validinfo from "../middleware/validinfo.js";
import authorization from "../middleware/authorization.js";

const router = Router();

router.post('/login', validinfo, signIn)

router.post('/register', validinfo, signUp)

router.get("/is-verify", authorization, isVerify)

export default router;