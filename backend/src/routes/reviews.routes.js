import { Router } from "express";
import { getAllReviews, createReview, updateReview, getReviewsByBarber, getMyReview } from "../controllers/review.controller.js";
import authorization from "../middleware/authorization.js";

const router = Router();

router.get('/reviews', getAllReviews)

router.get('/reviews-by-barber', getReviewsByBarber)

router.get('/my-review', authorization, getMyReview)

router.post('/create-review', authorization, createReview)

router.put('/review/:id', updateReview)

export default router;