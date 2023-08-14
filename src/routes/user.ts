import express, { Router } from "express";
import { getAccount, login, register, sendEmail, verifyOTPAndUpdatePassword } from "../controllers/user";
import verifyJWT from "../middlewares/verifyJWT";

const router: Router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getaccount", verifyJWT, getAccount);
router.post("/sendemail", sendEmail);
router.post("/changepassword", verifyOTPAndUpdatePassword);

export default router;
