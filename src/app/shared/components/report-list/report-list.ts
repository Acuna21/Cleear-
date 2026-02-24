import { Component, computed, signal } from '@angular/core';
import { Criticality } from '@enums/criticality';
import { Report } from '@models/report.model';

type Item = Report & { class: string };

@Component({
  selector: 'app-report-list',
  imports: [],
  templateUrl: './report-list.html',
  styleUrl: './report-list.scss',
})
export class ReportList {

  private reports = signal<Report[]>([
    { titulo: 'Problema con matrícula', usuario: 'Juan Pérez', criticidad: Criticality.CRITICAL, progreso: 25, tiempo: 'Hace 30 min' },
    { titulo: 'Solicitud de certificado', usuario: 'María García', criticidad: Criticality.LOW, progreso: 60, tiempo: 'Hace 2 horas' },
    { titulo: 'Actualización de notas', usuario: 'Carlos López', criticidad: Criticality.MEDIUM, progreso: 90, tiempo: 'Hace 5 horas' },
    { titulo: 'Queja de infraestructura', usuario: 'Ana Martínez', criticidad: Criticality.CRITICAL, progreso: 10, tiempo: 'Hace 1 hora' }
  ]);

  protected items = computed<Item[]>(() => this.reports().map((report) => ({
    ...report,
    class: this.classes[report.criticidad]
  })))

  private readonly classes: Record<Criticality, string> = {
    [Criticality.CRITICAL]: 'badge-critical',
    [Criticality.HIGH]: 'badge-high',
    [Criticality.MEDIUM]: 'badge-medium',
    [Criticality.LOW]: 'badge-low'
  };



}
