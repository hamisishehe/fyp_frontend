import { CollageModel } from "./collageModel";


export interface DepartmentModel {
  id: number;
  name: string;
  short_name: string;
  description: string;
  collage: CollageModel;
}
