export interface Session {
  day: string;
  time: string;
  Course: string;
  groups: string[];
  instructor: string;
  Venue: string;
}

export interface TimetableResponse {
  status: string;
  message: string;
  data: Session[];  // An array of sessions
}
