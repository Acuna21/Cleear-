export class TaskQuery {
  // Filtros
  reportedBy?: string;
  assignedTo?: string;
  state?: string;
  priority?: string;
  dateFrom?: string;
  dateTo?: string;
  department?: string;

  // Paginación
  page?: number = 1;
  limit?: number = 10;

  // Ordenamiento
  sort?: {
    field: string,
    order: 'asc' | 'desc'
  };

  // Selección de campos
  select?: string;

  // Para incluir timestamps
  includeTimestamps?: boolean = false;
}
