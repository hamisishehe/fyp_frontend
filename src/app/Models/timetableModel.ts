export interface Session {
  day: string;
  time: string;
  course_code: string;
  course_name: string;
  groups: string[];
  instructor: string;
  venue: string;
  session_type: string;
}

export interface TimetableResponse {
  status: string;
  message: string;
  generated_date: string; // Single generated date at the root level
  data: Session[];       // An array of sessions
}