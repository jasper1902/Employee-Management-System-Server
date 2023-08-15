import mongoose, { Document, Model } from "mongoose";
interface IEmployee extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hireDate: Date;
  salary: number;
  department: string;
  image: string;
}

interface IEmployeeMethods {
  toEmployResponse(url: string): ToEmployResponseType;
}

type EmployeeModel = Model<IEmployee, object, IEmployeeMethods>;

const employeeSchema = new mongoose.Schema<
  IEmployee,
  EmployeeModel,
  IEmployeeMethods
>({
  firstName: { type: String },
  lastName: { type: String },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    lowercase: true,
    index: true,
    match: [/^\S+@\S+.\S+$/, "is invalid"],
    trim: true,
    validate: {
      validator: (v: string) => /^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v),
      message: (props) => `${props.value} is not a valid email.`,
    },
  },
  phone: { type: String },
  hireDate: { type: Date },
  salary: { type: Number },
  department: { type: String },
  image: { type: String },
});

interface ToEmployResponseType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hireDate: string;
  salary: number;
  department: string;
  image: string;
}

employeeSchema.method(
  "toEmployResponse",
  function toEmployResponse(url: string) {
    try {
      const originalDateString: string = this.hireDate;
      const originalDate = new Date(originalDateString);

      originalDate.setDate(originalDate.getDate() + 2);

      const year = originalDate.getFullYear();
      const month = (originalDate.getMonth() + 1).toString().padStart(2, "0");
      const day = originalDate.getDate().toString().padStart(2, "0");

      const formattedResult = `${year}-${month}-${day}`;
      return {
        id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone,
        hireDate: formattedResult,
        salary: this.salary,
        department: this.department,
        image: `https://${url}${this.image}`,
      };
    } catch (error) {
      throw new Error("Failed to generate user response");
    }
  }
);

const Employee = mongoose.model<IEmployee, EmployeeModel>(
  "Employee",
  employeeSchema
);
export default Employee;
