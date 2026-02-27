import { Component, inject, OnInit, signal } from '@angular/core';
import { AlertCards } from '@components/alert-cards/alert-cards';
import { Button } from '@components/button/button';
import { TaskList } from '@components/task-list/task-list';
import { Search } from '@components/search/search';
import { Severity } from '@enums/severity';
import { Priority } from '@enums/priority';
import { AlertCardProps } from '@models/alert.model';
import { HomeTasks } from '@services/home-tasks';
import { SimpleTask } from '@models/simple-task.model';
import { finalize } from 'rxjs';
import { AppAuthManagement } from '@services/app-auth-management';
import { Role } from '@enums/role';
import { Router } from '@angular/router';

type AlertProps = AlertCardProps & { onClick: () => void };
type Tag = { icon: string, label: string, redirect: string };

@Component({
  selector: 'app-home',
  imports: [Search, Button, AlertCards, TaskList],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit{

  protected alerts = signal<AlertProps[]>([]);
  protected tags = signal<Tag[]>([])
  protected recentsTasks = signal<SimpleTask[]>([]);

  protected loadingAlerts = signal<boolean>(false)
  protected loadingRecents = signal<boolean>(false)

  private readonly homeTasks = inject(HomeTasks);
  private readonly appAuthManagement = inject(AppAuthManagement);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.fetchPrioritySummary();
    this.fetchRecentsTaks();
    this.setTags();
  }

  private fetchPrioritySummary():void {
    this.loadingAlerts.set(true);
    this.homeTasks.prioritySummary().pipe(
      finalize(() => this.loadingAlerts.set(false))
    ).subscribe(
      summary => {
        this.alerts.set([
          {
            title: 'Criticas',
            description: 'Requieren atencion inmediada',
            severity: Severity.CRITICAL,
            count: summary.CRITICAL,
            onClick: () => this.navigateWithPriority(Priority.CRITICAL)
          },{
            title: 'Importantes',
            description: 'Se deben tener muy en cuenta',
            severity: Severity.WARN,
            count: summary.HIGH + summary.MEDIUM,
            onClick: () => this.navigateWithPriority(Priority.HIGH)
          },{
            title: 'Postergables',
            description: 'Su revision no afecta alguna actividad.',
            severity: Severity.INFO,
            count: summary.LOW,
            onClick: () => this.navigateWithPriority(Priority.LOW)
          }
        ])
      }
    )
  }

  private fetchRecentsTaks():void {
    this.loadingRecents.set(true);
    this.homeTasks.recentsTasks().pipe(
      finalize(() => this.loadingRecents.set(false))
    ).subscribe(
      recents => this.recentsTasks.set(recents)
    );
  }

  private setTags():void {
    const generals: Tag[] = [
      { icon: 'fa-person', label: 'Reportadas por mi', redirect: '?reportedBy={me}' }
    ];

    const tags: Record<Role, Tag[]> = {
      [Role.ADMIN]: [
        ...generals,
        {icon: 'fa-tag', label: 'Todos', redirect: ''},
        { icon: 'fa-door-open', label: 'Abiertas', redirect: '?state=OPEN' },
      ],
      [Role.MAINTENANCE]: [
        ...generals,
        { icon: 'fa-person', label: 'Asignados a mi', redirect: '?assignedTo={techId}' },
        { icon: 'fa-door-open', label: 'Abiertas', redirect: '?state=OPEN&department=' },
        { icon: 'fa-clock', label: 'Agregadas hoy', redirect: '?from=&to=&department' },
        { icon: 'fa-tag', label: 'Mi area', redirect: '?department=' },
      ],
      [Role.REPORTER]: [
        ...generals,
        {icon: 'fa-tag', label: 'Todos', redirect: ''},
        { icon: 'fa-door-open', label: 'Abiertas', redirect: '?state=OPEN' },
      ]
    }

    const role = this.appAuthManagement.currentUser()?.role;
    if (role) {this.tags.set(tags[role])}
    else this.tags.set([]);
  }

  protected onAdd():void {
    this.router.navigate(['/create-report'])
  }

  protected viewTasks(){
    this.router.navigate(['/task-list'])
  }

  protected navigateWithPriority(priority: Priority): void {
    this.router.navigate(['/task-list'], { queryParams: { priority } });
  }

  protected navigateWithTag(tag: Tag): void {
    const params: Record<string, string> = {};
    if (tag.redirect) {
      const search = tag.redirect.startsWith('?') ? tag.redirect.substring(1) : tag.redirect;
      const urlParams = new URLSearchParams(search);
      urlParams.forEach((value, key) => {
        if (value) params[key] = value;
      });
    }
    this.router.navigate(['/task-list'], { queryParams: params });
  }

}
