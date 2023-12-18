import { Router } from "express";
import { getContactEmail } from "../controllers/contact.controller.js";

const router = Router();

router.post('/contact', getContactEmail)

export default router;