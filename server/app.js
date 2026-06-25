import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet"
import compression from "compression";
import swaggerUi from 'swagger-ui-express';



import {
  errorHandling,
  pageNotFound,
} from "./middlewares/errorHandlingMiddleware.js";

import limiter from "./utils/limiter.js";
import authRoutes from "./routes/authroutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import projectRoutes from "./routes/projectRoutes.js"
import serviceRoutes from './routes/serviceRoutes.js';
import skillRoutes from "./routes/skillRoutes.js"
import profileRoutes from './routes/profileRoutes.js'
import swaggerSpec from "./utils/swaggerSpec.js";
// import pingRoutes from "./routes/pingRoutes.js";

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"))
app.use(limiter)
app.use(helmet())
app.use(compression())


app.get("/", (req, res) =>{
  res.send("Hello Developer...")
})

// API Routes
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/profile", profileRoutes);

// 404 Handler   
app.use(pageNotFound);

// Error Handling
app.use(errorHandling);

export default app;
