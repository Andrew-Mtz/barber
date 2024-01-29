import { Router } from "express";
import { createReview, updateReview, getReviewsByBarber, getMyReview, getFilteredReviews } from "../controllers/review.controller.js";
import authorization from "../middleware/authorization.js";

const router = Router();

router.get('/reviews-by-barber', getReviewsByBarber)

router.get('/my-review', authorization, getMyReview)

router.get('/reviews-by-params', getFilteredReviews)

router.post('/create-review', authorization, createReview)

router.put('/review/:id', updateReview)

export default router;