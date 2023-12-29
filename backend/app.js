import express from "express";
import fileUpload from "express-fileupload";
import cors from 'cors';

//URL
import { FRONTEND_URL } from './config.js';

//Routes
import scheduleRoutes from "./routes/schedule.routes.js";
import availableScheduleRoutes from "./routes/availableSchedule.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import barberRoutes from "./routes/barbers.routes.js";
import haircutRoutes from "./routes/haircuts.routes.js";
import userRoutes from "./routes/user.routes.js";
import jwtAuth from "./routes/jwtAuth.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import reviewRoutes from "./routes/reviews.routes.js";
import incomeRoutes from "./routes/income.routes.js";
import linkBarberAndHaircutRoutes from "./routes/linkBarberAndHaircut.routes.js";

const corsOptions = {
  origin: FRONTEND_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
};

const app = express();

app.use(cors(corsOptions));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './upload'
}));
app.use(express.json());

//ROUTES//
app.use(bookingRoutes);
app.use(scheduleRoutes);
app.use(availableScheduleRoutes);
app.use(barberRoutes);
app.use(haircutRoutes);
app.use(userRoutes);
app.use(contactRoutes);
app.use(reviewRoutes);
app.use(incomeRoutes);
app.use(linkBarberAndHaircutRoutes);

//Register and Login routes//
app.use(jwtAuth);

export default app;