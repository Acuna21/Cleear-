import { Priority } from "@enums/priority";

export interface SimpleTask {
  id: string;
  title: string;
  priority: Priority;
  progress: number;
  time: string;
}
