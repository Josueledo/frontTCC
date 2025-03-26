import { Component } from '@angular/core';
import { LogService } from '../services/log.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faExpand, faGear, faQuestion, faFile, faLayerGroup, faBell } from '@fortawesome/free-solid-svg-icons';

import { Chart, registerables } from "chart.js";
Chart.register(...registerables)

@Component({
  selector: 'app-log-monitor',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './log-monitor.component.html',
  styleUrl: './log-monitor.component.scss',

})
export class LogMonitorComponent {
  logs: string[] = [];
  requestCount = 0;
  faGear = faGear
  faQuestion = faQuestion
  faFile = faFile
  faLayerGroup = faLayerGroup
  faBell = faBell
  faExpand = faExpand


  public config: any = {
    type: 'bar',
    data: {
      labels: ['JAN', 'FEB', "MAR", "APRIL", "MAY"],
      datasets: [{
        barPercentage: 0.5,
        barThickness: 10,
        maxBarThickness: 70,
        minBarLength: 2,
        data: [10, 20, 30, 40, 25],
        backgroundColor: 'rgb(123, 2, 192)',
        label: "Requests"
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };

  public configRadar:any = {
    type: 'line',
    
    data: {
      labels: ['JAN', 'FEB', "MAR","APRIL","MAY"],
      datasets: [{
        barPercentage: 0.5,
        barThickness: 20,
        maxBarThickness: 70,
        minBarLength: 2,
        data: [10, 50, 20,30,25,40,45,45],
        backgroundColor: 'orange',
        label: "Requests"
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  chart: any
  chart2: any
  constructor(private logService: LogService) { }

  ngOnInit() {
    this.chart = new Chart('MyChart', this.config)
    this.chart2 = new Chart('RadarChart', this.configRadar)

    this.logService.getLogs().subscribe({
      next: (log) => {
        console.log('Log adicionado à lista:', log);  // Log de depuração
        this.logs.push(log); // Adiciona o log à lista
      },
      error: (err) => {
        console.error('Erro ao receber logs:', err);
      },
      complete: () => {
        console.log('Conexão WebSocket finalizada');
      },
    });
    this.logService.requestCount$.subscribe(count => {
      this.requestCount = count;
    });
  }


}
