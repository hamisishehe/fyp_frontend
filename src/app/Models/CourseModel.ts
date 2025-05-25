import { DepartmentModel } from "./departmentModel";

export interface CourseData{
  id : number;
  course_code :string;
  course_name :string;
  semester :string;
  is_tutorial :boolean;
  is_lecture : boolean;
  is_practical :string;
  department:DepartmentModel;
}
