import express from "express";
import cors from 'cors';
import { FRONTEND_URL } from './config.js';

import scheduleRoutes from "./routes/schedule.routes.js";
import availableScheduleRoutes from "./routes/availableSchedule.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import barberRoutes from "./routes/barbers.routes.js";
import haircutRoutes from "./routes/haircuts.routes.js";
import userRoutes from "./routes/user.routes.js";
import jwtAuth from "./routes/jwtAuth.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import reviewRoutes from "./routes/reviews.routes.js";

const app = express()

const corsOptions = {
  origin: FRONTEND_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
};

app.use(cors(corsOptions));

//ROUTES//
app.use(bookingRoutes)
app.use(scheduleRoutes)
app.use(availableScheduleRoutes)
app.use(barberRoutes)
app.use(haircutRoutes)
app.use(userRoutes)
app.use(contactRoutes)
app.use(reviewRoutes)

//Register and Login routes//
app.use(jwtAuth)

app.listen(3000, ()=> {
  console.log('Server started on port 3000')
})