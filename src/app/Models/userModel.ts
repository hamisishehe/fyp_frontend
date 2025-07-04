import { DepartmentModel } from "./departmentModel";

export interface UserDetails {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role:string;
  department:string;
}
