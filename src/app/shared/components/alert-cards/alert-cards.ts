import { Component, computed, input } from '@angular/core';
import { Severity } from '@enums/severity';

@Component({
  selector: 'app-alert-cards',
  imports: [],
  templateUrl: './alert-cards.html',
  styleUrl: './alert-cards.scss',
})
export class AlertCards {
  title = input.required<string>();
  description = input<string>();
  severity = input.required<Severity>();
  count = input.required<number>();

  protected severityIcon = computed(() => {
    return this.severityIcons[this.severity()];
  })

  private readonly severityIcons : Record<Severity, string> = {
    [Severity.CRITICAL]: 'fa-triangle-exclamation',
    [Severity.WARN]: 'fa-bell',
    [Severity.INFO]: 'fa-circle-check',
  }
}
