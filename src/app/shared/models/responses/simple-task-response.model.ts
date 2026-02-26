import { Priority } from "@enums/priority"

export interface SimpleTaskResponse {
    data: SimpleDataResponse[],
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

export interface SimpleDataResponse {
  id: string;
  title: string;
  priority: Priority;
  created_at: string;
}

export interface MetaResponse {
  total: number,
  page: number,
  limit: number,
  hasMore: boolean,
  totalPages: number
}
