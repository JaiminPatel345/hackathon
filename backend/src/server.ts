import express, {Request, Response} from 'express';
import 'dotenv/config';
import {connectRedis} from './redis/redis.js';
import connectDB from "./configs/database.js";
import cors from 'cors'

// Import routes
import authRouter from './routes/auth.route.js';
import {CustomErrorHandler} from './types/server.types.js';
import {formatResponse} from "./types/custom.types.js";
import userRouter from "./routes/user.route.js";
import taskRoute from "./routes/task.route.js";
import chatRoute from "./routes/chat.route.js";


// Create Express app
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

declare global {
  namespace Express {
    interface Request {
      username?: string;
    }
  }
}

// Database connections
const startServer = async () => {
  try {
    // Connect to Redis
    connectRedis();

    // Connect to MongoDB
    connectDB();


    // Routes
    app.use('/chat', chatRoute)
    app.use('/task', taskRoute)
    app.use('/user', userRouter)
    app.use('/auth', authRouter);

    // Health check route
    app.get("/", (req: Request, res: Response) => {
      res.json({message: "Connected to Make My Buddy"});
    });

    // 404 Handler
    app.use((req: Request, res: Response) => {
      res.status(404).json(formatResponse(false, "Not Route Found"));
      return
    });

    // Error handling middleware
    const errorHandler: CustomErrorHandler = (error, req, res, next) => {
      console.error('Unhandled Error:', error);

      // Default to 500 if no status code is set
      const statusCode = error.status || 500;

      res.status(statusCode).json(formatResponse(false, error.message || "Internal Server Error", error));
    };

    app.use(errorHandler);

    // Start server
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server started on port ${PORT}`);
    });
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Run the server
startServer();

// Unhandled Promise Rejection Handler
process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optionally exit the process
  // process.exit(1);
});

// Uncaught Exception Handler
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  // Optionally exit the process
  // process.exit(1);
});

export default app;