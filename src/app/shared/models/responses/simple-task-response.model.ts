import { Priority } from "@enums/priority"
import { State } from "@enums/state"

export interface TaskResponse {
    data: TaskDataResponse[],
    meta: MetaResponse,
    stats: {
        byPriority: {
          CRITICAL: number,
          MEDIUM: number
        },
        byState: {
          ASSIGNED: number,
          NEW: number
        }
    }
}

export interface TaskDataResponse {
  id: string;
  title: string;
  priority: Priority;
  created_at: string;
  state: State;
  location: {
    id: string;
    name: string;
    type: string;
  },
  department: {
    id: string;
    name: string;
  },
  creator: {
    id: string;
    fullName: string;
  },
  assignee: {
    id: string;
    fullName: string;
  }
}

export interface MetaResponse {
  total: number,
  page: number,
  limit: number,
  hasMore: boolean,
  totalPages: number
}
