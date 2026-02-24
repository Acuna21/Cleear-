import { Component, OnInit, signal } from '@angular/core';
import { AlertCards } from '@components/alert-cards/alert-cards';
import { Button } from '@components/button/button';
import { ReportList } from '@components/report-list/report-list';
import { Search } from '@components/search/search';
import { Severity } from '@enums/severity';
import { AlertCardProps } from '@models/alert.model';

type AlertProps = AlertCardProps & { onClick: () => void };

@Component({
  selector: 'app-home',
  imports: [Search, Button, AlertCards, ReportList],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit{

  alerts = signal<AlertProps[]>([]);
  tags = signal<string[]>([])

  ngOnInit(): void {
    this.alerts.set([
      {
        title: 'Criticas',
        description: 'Requieren atencion inmediada',
        severity: Severity.CRITICAL,
        count: '2',
        onClick: () => {}
      },{
        title: 'En revision',
        description: 'Pendiente de respuesta',
        severity: Severity.WARN,
        count: '1',
        onClick: () => {}
      },{
        title: 'Resueltas',
        description: 'Completadas este mes',
        severity: Severity.INFO,
        count: '45',
        onClick: () => {}
      }
    ])

    this.tags.set(['cascada', 'cascada', 'cascada', 'cascada'])
  }

}
