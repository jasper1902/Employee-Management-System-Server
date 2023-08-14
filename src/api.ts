import express, { NextFunction, Response, Request } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import userRoute from "./routes/user";
import employeeRoute from "./routes/employee";
import createHttpError, { isHttpError } from "http-errors";
import { catchInvalidJsonError } from "./middlewares/catchInvalidJsonError";
import path from "path";

dotenv.config();
export const app = express();

connectDB(process.env.MONGO_URI as string);
app.use(express.json());
app.use(cors());
app.use(catchInvalidJsonError);

app.use("/api/account", userRoute);
app.use("/api/employee", employeeRoute);

app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/public/images/:imageName", (req, res) => {
  const imagePath = path.join(__dirname, "public", "images", req.params.imageName);
  
  res.sendFile(imagePath, (error) => {
    if (error) {
      console.error("Error sending file:", error);
      res.status(404).send("Image not found");
    }
  });
});

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});
