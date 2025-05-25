import { DepartmentModel } from "./departmentModel";

export interface StudentData{
  id: number;
  programme: string;
  programme_code:string;
  total_students: number;
  department:DepartmentModel;
}
