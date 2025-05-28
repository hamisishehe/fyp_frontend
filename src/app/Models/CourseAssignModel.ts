export interface CourseMatrixView {
  course_matrix_id: number;
  course: Course;
  course_matrix:CourseMatrix;
  instructor: Instructor;
  student: Student;
  studentProgrammes?: string;
}

export interface Course {
  id: number;
  name: string;
  code: string;
  semester: number;
}

export interface Instructor {
  id: number;
  name: string;
  email: string;
  title: string;
}

export interface Student {
  id: number;
  programme: string;
  programme_code:string;
  total_students: number;
}

export interface CourseMatrix{
  program_group:string;
}
