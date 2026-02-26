import { SimpleTask } from './simple-task.model';
import { MetaResponse } from './responses/simple-task-response.model';

export interface PaginatedTasksResponse {
  tasks: SimpleTask[];
  meta: MetaResponse;
}
