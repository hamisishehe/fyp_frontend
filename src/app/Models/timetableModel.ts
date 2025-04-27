export interface Session {
  day: string;
  time: string;
  course_code: string;
  groups: string[];
  instructor: string;
  venue: string;
  session_type:string;
}

export interface TimetableResponse {
  status: string;
  message: string;
  data: Session[];  // An array of sessions
}
