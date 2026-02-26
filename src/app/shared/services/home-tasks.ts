import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Priority } from '@enums/priority';
import { environment } from '@environments/environment';
import { PrioritySummary } from '@models/priority-summary.model';
import { SimpleTaskResponse } from '@models/responses/simple-task-response.model';
import { SimpleTask } from '@models/simple-task.model';
import { getRelativeTime } from '@utils/date-utils';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeTasks {

  private readonly http = inject(HttpClient);

  recentsTasks(): Observable<SimpleTask[]> {
    const { url: urlApi, tasks } = environment.api;
    const url = `${urlApi+tasks}?limit=4&includeTimestamps=true&sort=created_at:desc&select=id,title,priority`
    return this.http.get<SimpleTaskResponse>(url).pipe(
      map( res => {
        return res.data.map<SimpleTask>( task => ({
          id: task.id,
          title: task.title,
          priority: task.priority,
          progress: 0,
          time: getRelativeTime(task.created_at)
        }))
      }),
      catchError( () => of([]) )
    )
  }

  prioritySummary(): Observable<PrioritySummary> {
    const url = environment.api.url + environment.api.prioritySummary
    return this.http.get<PrioritySummary>(url).pipe(
      map( res => res ),
      catchError( error => of({
        [Priority.CRITICAL]: 0,
        [Priority.HIGH]: 0,
        [Priority.MEDIUM]: 0,
        [Priority.LOW]: 0
      }))
    )
  }

}
