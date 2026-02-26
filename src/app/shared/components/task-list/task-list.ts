import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Priority } from '@enums/priority';
import { Role } from '@enums/role';
import { SimpleTask } from '@models/simple-task.model';
import { AppAuthManagement } from '@services/app-auth-management';

type Item = SimpleTask & { class: string };

@Component({
  selector: 'app-task-list',
  imports: [],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {

  private readonly appAuthManagement = inject(AppAuthManagement);

  tasks = input.required<SimpleTask[]>();

  protected showProgress = computed(() =>
    this.appAuthManagement.currentUser()?.role !== Role.REPORTER
  )
  protected items = computed<Item[]>(() => this.tasks().map((task) => ({
    ...task,
    class: this.classes[task.priority]
  })))

  private readonly classes: Record<Priority, string> = {
    [Priority.CRITICAL]: 'badge-critical',
    [Priority.HIGH]: 'badge-high',
    [Priority.MEDIUM]: 'badge-medium',
    [Priority.LOW]: 'badge-low'
  };

}
