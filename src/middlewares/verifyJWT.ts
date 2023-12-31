import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId: string;
  userEmail: string;
}

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader: string | undefined = getAuthHeader(req.headers);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.TOKEN || typeof process.env.TOKEN !== "string") {
      return res.status(500).json({ message: "Token is not configured" });
    }

    const decoded = jwt.verify(token, process.env.TOKEN) as JwtPayload;

    if (typeof decoded === "object" && "user" in decoded) {
      const extendedReq = req as AuthRequest;
      extendedReq.userId = decoded.user.id as string;
      extendedReq.userEmail = decoded.user.email as string;
      next();
    } else {
      throw new Error("Invalid token payload");
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token" });
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAuthHeader = (headers: any): string | undefined => {
  const authHeader =
    headers.authorization ||
    headers.Authorization ||
    headers["auth-token"] ||
    headers["Auth-token"];

  if (Array.isArray(authHeader)) {
    return authHeader[0];
  }

  return authHeader;
};

export default verifyJWT;
