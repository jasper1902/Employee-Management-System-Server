import express, { Router } from "express";
import {
  createEmployee,
  deleteEmployeeById,
  getAllEmployees,
  updateEmployee,
} from "../controllers/employee";
import verifyAdmin from "../middlewares/verifyAdmin";

const router: Router = express.Router();

router.post("/create", verifyAdmin, createEmployee);
router.get("/", verifyAdmin, getAllEmployees);
router.delete("/delete/:id", verifyAdmin, deleteEmployeeById);
router.put("/update/:id", verifyAdmin, updateEmployee);

export default router;
