export interface CourseMatrixView {
  course_matrix_id: number;
  course: Course;
  instructor: Instructor;
  student: Student;
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
  total_students: number;
}
