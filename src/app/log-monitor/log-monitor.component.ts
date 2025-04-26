import { Component, ViewChild } from '@angular/core';
import { LogService } from '../services/log.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faExpand,
  faGear,
  faQuestion,
  faFile,
  faLayerGroup,
  faBell,
  faMobile,
  faDesktop,
} from '@fortawesome/free-solid-svg-icons';
import { NgxEchartsModule, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-log-monitor',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, NgxEchartsModule],
  templateUrl: './log-monitor.component.html',
  styleUrl: './log-monitor.component.scss',
  providers: [provideEchartsCore({ echarts })],
})
export class LogMonitorComponent {
  faMobile = faMobile;
  faGear = faGear;
  faDesktop = faDesktop;
  faQuestion = faQuestion;
  faFile = faFile;
  faLayerGroup = faLayerGroup;
  faBell = faBell;
  faExpand = faExpand;

  requestCount = 2;
  base = +new Date(1968, 9, 3);
  oneDay = 24 * 3600 * 1000;
  date: string[] = [];
  logs: any[] = [];
  lastMobile: any = [];
  lastDesktop: any = [];
  requestLastMobile = 0;
  requestLastDesktop = 0;
  data: number[] = [Math.random() * 300];
  logsPorMinuto: { [key: string]: number } = {};
  ofensasPorMinuto: { [key: string]: number } = {};
  requestCounts: { [ip: string]: number } = {};
  blockedIPs: Set<string> = new Set();
  MAX_REQUESTS_PER_MINUTE = 100;
  ipCounts: Map<string, number> = new Map();
  ipMatch :any

  mobile = {
    tooltip: {
      trigger: 'item',
    },
    color: ['rgb(255, 149, 0)', 'rgba(110, 109, 111, 0.43)'],
    legend: {
      show: false,
      top: '5%',
      left: 'center',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 40,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: this.requestLastMobile, name: 'Search Engine' },
          { value: 30, name: 'Direct' },
        ],
      },
    ],
  };
  desktop = {
    tooltip: {
      trigger: 'item',
    },
    color: ['rgb(255, 149, 0)', 'rgba(110, 109, 111, 0.43)'],
    legend: {
      show: false,
      top: '5%',
      left: 'center',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 40,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: this.requestLastDesktop, name: 'Search Engine' },
          { value: 30, name: 'Direct' },
        ],
      },
    ],
  };

  mainOption = {
    title: {
      color: ['#fffff'],
      text: 'Requests per minute',
      subtext: 'Dados simulados',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      color: ['#fffff'],
      data: ['Requests'],
    },
    color: ['rgb(123, 2, 192)'],
    toolbox: {
      show: true,
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    calculable: true,
    xAxis: [
      {
        type: 'category',
        data: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: 'Requests',
        type: 'bar',
        data: [
          2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3,
        ],
        markPoint: {
          data: [
            { type: 'max', name: 'Máximo' },
            { type: 'min', name: 'Mínimo' },
          ],
        },
        markLine: {
          data: [{ type: 'average', name: 'Média' }],
        },
      },
    ],
  };

  radialOption = {
    color: ['rgb(255, 149, 0)', 'rgba(110, 109, 111, 0.43)'],

    tooltip: {
      trigger: 'item',
    },
    legend: {
      show: false,
      top: '5%',
      left: 'center',
    },
    series: [
      {
        label: { show: false },
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '70%'],
        // adjust the start and end angle
        startAngle: 180,
        endAngle: 360,
        data: [
          { value: this.requestCount, name: 'Search Engine' },
          { value: 10, name: 'Direct' },
        ],
      },
    ],
  };

  constructor(private logService: LogService, private router: Router) {}

  goToBlockedIps() {
    this.router.navigate(['/blocks']);
  }

  ngOnInit() {
    for (let i = 1; i < 20000; i++) {
      var now = new Date((this.base += this.oneDay));
      this.date.push(
        [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/')
      );
      this.data.push(Math.round((Math.random() - 0.5) * 20 + this.data[i - 1]));
    }

    this.logService.getLogs().subscribe({
      next: (log) => {
        this.logs.push(this.parseLog(log));
        console.log(this.logs)

        const ipMatch = log.match(/IP:\s*([\d.:a-fA-F]+)/);
        const ip = ipMatch ? ipMatch[1] : null;

        if (ip) {
          // Bloqueado? Ignora.
          if (this.blockedIPs.has(ip)) {
            console.warn(`❌ IP ${ip} está bloqueado e foi ignorado.`);
            return;
          }

          // Conta a requisição
          const atual = this.ipCounts.get(ip) || 0;
          this.ipCounts.set(ip, atual + 1);

          // Verifica possível DDoS
          if (this.ipCounts.get(ip)! > this.MAX_REQUESTS_PER_MINUTE) {
            console.warn(`🚨 IP ${ip} bloqueado por possível DDoS.`);

            this.blockedIPs.add(ip);

            setTimeout(() => {
              this.blockedIPs.delete(ip);
              console.log(`🔓 IP ${ip} desbloqueado após 2 minutos.`);
              this.ipCounts.delete(ip); // limpa contagem também

            }, 2 * 60 * 1000); // 2 minutos
          }
        }
        this.ipMatch = log.match(/IP:\s*([\d.:a-fA-F]+)/);

        if (ipMatch) {
          const ip = ipMatch[1];
        
          if (log.includes('Android')) {
            this.lastMobile = ip;
            this.requestLastMobile = this.logs.filter((l) =>
              l.ip.includes(this.lastMobile)
            ).length;
          } else {
            this.lastDesktop = ip;
            console.log(this.lastDesktop);
            this.requestLastDesktop = this.logs.filter((l) =>
              l.ip.includes(this.lastDesktop)
            ).length;
          }
        }
      },
      error: (err) => {
        console.error('Erro ao receber logs:', err);
      },
      complete: () => {
        console.log('Conexão WebSocket finalizada');
      },
    });
    this.logService.requestCount$.subscribe((count) => {
      this.requestCount = count;
      this.updateChart();
    });
    this.logService.logsPorMinuto$.subscribe((dados) => {
      const minutos = Object.keys(dados).sort(); // ordena por tempo
      const valores = minutos.map((minuto) => dados[minuto]);

      this.mainOption = {
        ...this.mainOption,
        xAxis: [
          {
            type: 'category',
            data: minutos,
          },
        ],
        series: [
          {
            name: 'Requests',
            type: 'bar',
            data: valores,
            markPoint: {
              data: [
                { type: 'max', name: 'Máximo' },
                { type: 'min', name: 'Mínimo' },
              ],
            },
            markLine: {
              data: [{ type: 'average', name: 'Média' }],
            },
          },
        ],
      };
    });
  }
  parseLog(log: string) {
    const logInfo: any = {};
  
    const ipMatch = log.match(/IP: ([^,]+)/);
    const methodMatch = log.match(/Metodo: ([^,]+)/);
    const uriMatch = log.match(/URI: ([^,]+)/);
    const agentMatch = log.match(/Agente: (.+)/);
  
    logInfo.ip = ipMatch ? ipMatch[1] : '';
    logInfo.method = methodMatch ? methodMatch[1] : '';
    logInfo.uri = uriMatch ? uriMatch[1] : '';
    logInfo.agent = agentMatch ? agentMatch[1] : '';
  
    if (log.includes('🚨')) {
      logInfo.status = 'suspeito';
    } else if (log.includes('🌊')) {
      logInfo.status = 'ddos';
    } else if (log.includes('✅')) {
      logInfo.status = 'sucesso';
    } else if (log.includes('🔒') || log.includes('🚫')) {
      logInfo.status = 'bloqueado';
    } else {
      logInfo.status = 'normal';
    }
  
    return logInfo;
  }
  updateChart() {
    this.radialOption = {
      ...this.radialOption,
      series: [
        {
          ...this.radialOption.series[0],
          data: [
            { value: this.requestCount, name: 'Search Engine' },
            { value: 10, name: 'Direct' },
          ],
        },
      ],
    };
    this.mobile = {
      ...this.mobile,
      series: [
        {
          ...this.mobile.series[0],
          data: [
            { value: this.requestLastMobile, name: 'Search Engine' },
            { value: 10, name: 'Direct' },
          ],
        },
      ],
    };
    this.desktop = {
      ...this.desktop,
      series: [
        {
          ...this.desktop.series[0],
          data: [
            { value: this.requestLastDesktop, name: 'Search Engine' },
            { value: 10, name: 'Direct' },
          ],
        },
      ],
    };
  }
}
