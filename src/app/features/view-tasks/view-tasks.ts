import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskList } from '@components/task-list/task-list';
import { Priority } from '@enums/priority';
import { SimpleTask } from '@models/simple-task.model';
import { State } from '@enums/state';
import { TaskInventory } from '@services/task-inventory';
import { TaskQuery } from '@models/task-query';
import { MetaResponse } from '@models/responses/simple-task-response.model';

type SortOption = 'recent' | 'oldest' | 'priority-high' | 'priority-low' | 'progress' | 'title-az' | 'title-za';
type StateOption = { label: string; value: State | 'ALL' };

@Component({
  selector: 'app-view-tasks',
  standalone: true,
  imports: [TaskList, FormsModule, CommonModule],
  templateUrl: './view-tasks.html',
  styleUrl: './view-tasks.scss',
})
export class ViewTasks implements OnInit {
  private readonly taskInventory = inject(TaskInventory);

  // Signals para filtros y paginación
  searchTerm = signal('');
  selectedPriority = signal<Priority | 'ALL'>('ALL');
  selectedState = signal<string>('ALL');
  selectedCategory = signal<string>('ALL');
  sortBy = signal<SortOption>('recent');
  currentPage = signal(1);
  itemsPerPage = signal(10);

  // Signals para datos y metadata del servidor
  currentTasks = signal<SimpleTask[]>([]);
  serverMeta = signal<MetaResponse>({
    total: 0,
    page: 1,
    limit: 10,
    hasMore: false,
    totalPages: 0
  });
  isLoading = signal(false);

  // Enums para template
  protected Priority = Priority;
  protected State = State;
  protected states: StateOption[] = [
    { label: 'Todos los estados', value: 'ALL' },
    { label: 'Pendiente', value: State.NEW },
    { label: 'En Progreso', value: State.IN_PROGRESS },
    { label: 'En Espera', value: State.ASSIGNED },
    { label: 'Completado', value: State.RESOLVED },
    { label: 'Rechazado', value: State.CANCELLED }
  ];

  protected priorities = [
    { label: 'Toda criticidad', value: 'ALL' },
    { label: 'Crítico', value: Priority.CRITICAL },
    { label: 'Alto', value: Priority.HIGH },
    { label: 'Medio', value: Priority.MEDIUM },
    { label: 'Bajo', value: Priority.LOW }
  ];

  protected sortOptions = [
    { label: 'Más recientes', value: 'recent' as SortOption },
    { label: 'Más antiguos', value: 'oldest' as SortOption },
    { label: 'Criticidad (alta primero)', value: 'priority-high' as SortOption },
    { label: 'Criticidad (baja primero)', value: 'priority-low' as SortOption },
    { label: 'Progreso (mayor)', value: 'progress' as SortOption },
    { label: 'Título (A-Z)', value: 'title-az' as SortOption },
    { label: 'Título (Z-A)', value: 'title-za' as SortOption }
  ];

  // Computed properties que dependen de metadata del servidor
  protected totalTasks = computed(() => this.serverMeta().total);
  protected totalPages = computed(() => this.serverMeta().totalPages);

  protected startIndex = computed(() =>
    this.totalTasks() === 0 ? 0 : (this.currentPage() - 1) * this.itemsPerPage() + 1
  );

  protected endIndex = computed(() =>
    Math.min(this.currentPage() * this.itemsPerPage(), this.totalTasks())
  );

  constructor() {
    // Effect para cargar datos cuando cambian filtros o paginación
    effect(() => {
      this.loadTasks();
    });
  }

  ngOnInit(): void {
    // Carga inicial
    this.loadTasks();
  }

  private loadTasks(): void {
    this.isLoading.set(true);

    const query: TaskQuery = {
      page: this.currentPage(),
      limit: this.itemsPerPage(),
      sort: this.getSortQuery()
    };

    // Agregar filtros si no son 'ALL'
    if (this.selectedPriority() !== 'ALL') {
      query.priority = this.selectedPriority() as Priority;
    }

    if (this.selectedState() !== 'ALL') {
      query.state = this.selectedState() as State;
    }

    this.taskInventory.fetchTasks(query).subscribe({
      next: (response) => {
        this.currentTasks.set(response.tasks);
        this.serverMeta.set(response.meta);
        this.isLoading.set(false);
      },
      error: () => {
        this.currentTasks.set([]);
        this.isLoading.set(false);
      }
    });
  }

  private getSortQuery(): { field: string; order: 'asc' | 'desc' } {
    const sortMap: Record<SortOption, { field: string; order: 'asc' | 'desc' }> = {
      recent: { field: 'created_at', order: 'desc' },
      oldest: { field: 'created_at', order: 'asc' },
      'priority-high': { field: 'priority', order: 'desc' },
      'priority-low': { field: 'priority', order: 'asc' },
      progress: { field: 'progress', order: 'desc' },
      'title-az': { field: 'title', order: 'asc' },
      'title-za': { field: 'title', order: 'desc' }
    };

    return sortMap[this.sortBy()];
  }

  protected onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  protected onItemsPerPageChange(items: number): void {
    this.itemsPerPage.set(items);
    this.currentPage.set(1);
  }

  protected onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  protected onFilterChange(): void {
    this.currentPage.set(1);
  }
}
