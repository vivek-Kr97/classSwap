import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { serve, setup } from "swagger-ui-express";
import { connectDb } from "./config/db";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/error.middleware";
import apiRoutes from "./routes";
import swaggerDocument from "./swagger.json";

export const app: Application = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:3000",
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV !== "production") {
        callback(null, origin || true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  }),
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});

app.use(limiter);

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Interactive Swagger Documentation
app.use("/docs", serve, setup(swaggerDocument));
app.use("/api-docs", serve, setup(swaggerDocument));

// Base Health Check at root /health
app.get("/health", (_req, res) => {
  return res.status(200).json({
    status: "ok",
    service: "ClassSwap API",
    docs: "http://localhost:4000/docs",
  });
});

// API Routes Mounted at /api and /api/v1
app.use("/api", apiRoutes);
app.use("/api/v1", apiRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = env.PORT || 4000;

const startServer = async () => {
  await connectDb();

  app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`ClassSwap API Server running on port ${PORT}`);
    console.log(`Environment: ${env.NODE_ENV}`);
    console.log(`Health Check: http://localhost:${PORT}/api/health`);
    console.log(`Swagger UI Documentation: http://localhost:${PORT}/docs`);
    console.log(`=================================`);
  });
};

if (env.NODE_ENV !== "test") {
  startServer();
}

export default app;
