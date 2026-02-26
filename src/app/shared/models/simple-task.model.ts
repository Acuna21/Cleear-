import { Priority } from "@enums/priority";
import { State } from "@enums/state";

export interface SimpleTask {
  id: string;
  title: string;
  priority: Priority;
  state?: State;
  progress: number;
  time: string;
  date: Date;
  department?: {
    id: string;
    name: string;
  },
}
