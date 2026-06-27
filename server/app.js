import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import swaggerUi from "swagger-ui-express";

import {
  errorHandling,
  pageNotFound,
} from "./middlewares/errorHandlingMiddleware.js";

import limiter from "./utils/limiter.js";

import indexRoute from "./routes/indexRoute.js";
import swaggerSpec from "./utils/swaggerSpec.js";
// import pingRoutes from "./routes/pingRoutes.js";

const app = express();

// Global Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL, // ✅ Sirf tera frontend
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(limiter);
app.use(helmet());
app.use(compression());

app.get("/", (req, res) => {
  res.send("Hello Developer...");
});

// API Routes
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", indexRoute);

// 404 Handler
app.use(pageNotFound);

// Error Handling
app.use(errorHandling);

export default app;
