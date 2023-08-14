import { NextFunction, RequestHandler, Request, Response } from "express";
import { Query, ParamsDictionary } from "express-serve-static-core";
import { MulterError } from "multer";
import { uploadAvatar } from "../middlewares/multer";
import Employee from "../models/Employee";

interface CreatedEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hireDate: string;
  salary: string;
  department: string;
  image: string;
}

export const createEmployee: RequestHandler = async (
  request: Request<
    ParamsDictionary,
    unknown,
    CreatedEmployeeRequest,
    Query,
    Record<string, unknown>
  >,
  response: Response,
  nextFunction: NextFunction
) => {
  try {
    uploadAvatar(request, response, async function handleAvatarUpload(err) {
      if (err instanceof MulterError) {
        console.error(err);
        return response
          .status(400)
          .json({ message: "File upload error", error: err.message });
      } else if (err) {
        console.error(err);
        return response
          .status(500)
          .json({ message: "Internal Server Error", error: err.message });
      }

      const {
        firstName,
        lastName,
        email,
        phone,
        hireDate,
        salary,
        department,
      } = request.body;

      const emailAlreadyExists = await Employee.findOne({ email }).exec();
      if (emailAlreadyExists) {
        return response.status(400).json({ message: "Email already exists" });
      }

      const imagePath = request.file?.filename
        ? `/public/images/${request.file.filename}`
        : undefined;

      const newEmployeeObject = {
        firstName,
        lastName,
        email,
        phone,
        hireDate,
        salary: parseInt(salary, 10),
        department,
        image: imagePath,
      };

      const newEmployee = await Employee.create(newEmployeeObject);

      const host = request.headers.host ?? "";
      const protocol = request.protocol;
      response
        .status(201)
        .json({ employee: newEmployee.toEmployResponse(protocol, host) });
    });
  } catch (error) {
    nextFunction(error);
  }
};

export const getAllEmployees: RequestHandler = async (
  request: Request,
  response: Response,
  nextFunction: NextFunction
) => {
  try {
    const employees = await Employee.find().exec();
    const host = request.headers.host ?? "";
    const protocol = request.protocol;
    const employeesResponse = employees.map((employee) =>
      employee.toEmployResponse(protocol, host)
    );
    response.status(200).json({ employees: employeesResponse });
  } catch (error) {
    nextFunction(error);
  }
};

export const deleteEmployeeById: RequestHandler = async (
  request: Request,
  response: Response,
  nextFunction: NextFunction
) => {
  try {
    const { id } = request.params;
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return response.status(404).json({ message: "Employee not found" });
    }
    response.status(204).json({ message: "Employee deleted successfully" });
  } catch (error) {
    nextFunction(error);
  }
};

export const updateEmployee: RequestHandler = async (
  request: Request<
    ParamsDictionary,
    unknown,
    CreatedEmployeeRequest,
    Query,
    Record<string, unknown>
  >,
  response: Response,
  nextFunction: NextFunction
) => {
  try {
    uploadAvatar(request, response, async function handleAvatarUpload(err) {
      if (err instanceof MulterError) {
        console.error(err);
        return response
          .status(400)
          .json({ message: "File upload error", error: err.message });
      } else if (err) {
        console.error(err);
        return response
          .status(500)
          .json({ message: "Internal Server Error", error: err.message });
      }

      const { id } = request.params;

      const {
        firstName,
        lastName,
        email,
        phone,
        hireDate,
        salary,
        department,
      } = request.body;

      let newEmployeeObject;

      if (request.file?.filename) {
        newEmployeeObject = {
          firstName,
          lastName,
          email,
          phone,
          hireDate,
          salary: parseInt(salary, 10),
          department,
          image: `/public/images/${request.file?.filename}`,
        };
      } else {
        newEmployeeObject = {
          firstName,
          lastName,
          email,
          phone,
          hireDate,
          salary: parseInt(salary, 10),
          department,
        };
      }

      try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
          id,
          newEmployeeObject,
          { new: true }
        );

        if (!updatedEmployee) {
          return response.status(404).json({ message: "Employee not found" });
        }

        const host = request.headers.host ?? "";
        const protocol = request.protocol;
        response
          .status(200)
          .json({ employee: updatedEmployee.toEmployResponse(protocol, host) });
      } catch (error) {
        nextFunction(error);
      }
    });
  } catch (error) {
    nextFunction(error);
  }
};
