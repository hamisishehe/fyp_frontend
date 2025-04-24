export interface Venue {
  id: number;
  name: string;
  location: string;
  exam_capacity: number;
  teaching_capacity: number;
  type: 'CLASS' | 'LAB' | 'HALL'; // adjust based on your VenueType enum
  coordinator_id: number;
}
