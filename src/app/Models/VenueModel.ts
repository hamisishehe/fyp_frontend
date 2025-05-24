export interface Venue {
  id: number;
  name: string;
  location: string;
  exam_capacity: number;
  teaching_capacity: number;
  type: 'CLASS' | 'LAB' | 'HALL';
  coordinator_id: number;
}
