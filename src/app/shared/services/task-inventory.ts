import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Priority } from '@enums/priority';
import { State } from '@enums/state';
import { environment } from '@environments/environment';
import { PaginatedTasksResponse } from '@models/paginated-tasks-response.model';
import { TaskDataResponse, TaskResponse } from '@models/responses/simple-task-response.model';
import { SimpleTask } from '@models/simple-task.model';
import { Task } from '@models/task';
import { CreateTaskDto } from '@models/task-dto.model';
import { TaskQuery } from '@models/task-query';
import { getRelativeTime } from '@utils/date-utils';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskInventory {

  private readonly baseUrl = environment.api.url + environment.api.tasks;
  private readonly http = inject(HttpClient);

  fetchTasks(query?: TaskQuery): Observable<PaginatedTasksResponse> {
    const { url: urlApi, tasks } = environment.api;
    const url = new URL(tasks, urlApi);
    url.search = this.paramsBuilder(query);
    return this.http.get<TaskResponse>(url.toString()).pipe(
      map(response => ({
        tasks: response.data.map<SimpleTask>(task => this.mapToSimpleTask(task)),
        meta: response.meta
      })),
      catchError(() => of({ tasks: [], meta: { total: 0, page: 1, limit: 10, hasMore: false, totalPages: 0 } }))
    );
  }

  getById(id:string): Observable<Task | null> {
    const { url: UrlApi, tasks } = environment.api
    const url = `${UrlApi+tasks}/${id}`;
    return this.http.get<TaskDataResponse>(url).pipe(
      map( res => {
        if (!res) return null;
        return this.mapToTask(res)
      }),
      catchError(() => of(null))
    )
  }

  addTask(createTask: CreateTaskDto):Observable<Task>{
    return this.http.post<TaskDataResponse>(this.baseUrl, createTask)
      .pipe( map( res => this.mapToTask(res)) )
  }

  private mapToSimpleTask(taskDataResponse: TaskDataResponse ): SimpleTask {
    const { created_at, department, id, priority, title, state } = taskDataResponse;
    const { id: departmentId, name: departmentName } = department || {};
    return ({
      id,
      title,
      priority,
      state,
      date: new Date(created_at),
      time: getRelativeTime(created_at),
      progress: 0,
      department: {
        id: departmentId,
        name: departmentName,
      }
    })
  }

  private mapToTask(taskDataResponse: TaskDataResponse): Task {
    const { created_at, description, department, id, priority, title, state, creator, assignee, location, weight, tags } = taskDataResponse;
    return ({
      id,
      title: title || 'Titulo no disponible',
      description,
      state,
      priority,
      weight: Math.max(weight, 10),
      tags : tags.filter( tag => !!tag ),
      location: {
        id: location.id,
        name: location.name || 'Nombre no disponible',
        type: location.type || 'Tipo no disponible',
      },
      assignee: {
        id: assignee.id,
        fullName: assignee.fullName || 'Nombre no disponible'
      },
      creator: {
        id: creator.id,
        fullName: creator.fullName || 'Nombre no disponible',
      },
      department: {
        id: department.id,
        name: department.name || 'Nombre no disponible'
      },
      creationDate: new Date(created_at),
      time: getRelativeTime(created_at)
    })
  }

  private paramsBuilder(query?: TaskQuery): string {
    const {
      reportedBy,
      assignedTo,
      state,
      priority,
      dateFrom,
      dateTo,
      department,
      page = 1,
      limit = 10,
      sort = { field: 'created_at', order: 'desc' },
      includeTimestamps = false,
    } = query || {};


    const filter: Record<string, any> = {};

    // Validar paginación
    filter['page'] = Math.max(1, page);
    filter['limit'] = Math.min(100, Math.max(1, limit));
    filter['sort'] = `${sort.field}:${sort.order}`

    if (reportedBy) {
      filter['created_by_id'] = reportedBy;
    }

    if (assignedTo) {
      filter['assigned_to_id'] = assignedTo;
    }

    if (state) {
      filter['state'] = state as State;
    }

    if (priority) {
      filter['priority'] = priority as Priority;
    }

    if (department) {
      filter['department_id'] = department;
    }

    if (dateFrom) {
      filter['dateFrom'] = dateFrom
    }

    if (dateTo) {
      filter['dateTo'] = dateTo
    }

    if (includeTimestamps) {
      filter['includeTimestamps'] = includeTimestamps;
    }

    return new URLSearchParams(filter).toString()
  }

}
