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

@Component({
  selector: 'app-log-monitor',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, NgxEchartsModule],
  templateUrl: './log-monitor.component.html',
  styleUrl: './log-monitor.component.scss',
  providers: [provideEchartsCore({ echarts })],
})
export class LogMonitorComponent {

  logs: string[] = [];
  requestCount = 2;
  faMobile = faMobile;
  faGear = faGear;
  faDesktop = faDesktop;
  faQuestion = faQuestion;
  faFile = faFile;
  faLayerGroup = faLayerGroup;
  faBell = faBell;
  faExpand = faExpand;
  base = +new Date(1968, 9, 3);
  oneDay = 24 * 3600 * 1000;
  date: string[] = [];
  lastMobile:any = []
  lastDesktop:any = []
  requestLastMobile = 0
  requestLastDesktop = 0
  data: number[] = [Math.random() * 300];

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
      color:['#fffff'],
      text: 'Request vs Offenses',
      subtext: 'Data',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      color:['#fffff'],
      data: ['Request', 'Offense'],
    },
    color: ['rgb(123, 2, 192)', 'rgb(67, 39, 119)'],
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
        color:['#fff'],

        type: 'category',
        // prettier-ignore
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' },
          ],
        },
        markLine: {
          data: [{ type: 'average', name: 'Avg' }],
        },
      },
      {
        name: 'Offenses',
        type: 'bar',
        data: [
          2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3,
        ],
        markPoint: {
          data: [
            { name: 'Max', value: 182.2, xAxis: 7, yAxis: 183 },
            { name: 'Min', value: 2.3, xAxis: 11, yAxis: 3 },
          ],
        },
        markLine: {
          data: [{ type: 'average', name: 'Avg' }],
        },
      },
    ],
  };

  radialOption = {
    color: ['rgb(255, 149, 0)', 'rgba(110, 109, 111, 0.43)'],

    tooltip: {
      trigger: 'item'
    },
    legend: {
      show:false,
      top: '5%',
      left: 'center',
    },
    series: [
      {
        label:{show:false},
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
         
        ]
      }
    ]
  };
  

  constructor(private logService: LogService) {}

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
        console.log('Log adicionado à lista:', log); // Log de depuração
        this.logs.push(log); // Adiciona o log à lista
        if (log.includes("Android")) {
          const ipMatch = log.match(/IP:\s*([\d.:a-fA-F]+)/);
          
          if (ipMatch) {
              this.lastMobile = ipMatch[1]; // Pegando apenas o IP      
              this.requestLastMobile = this.logs.filter(l => l.includes(this.lastMobile)).length;
      
          }
      }else{
        const ipMatch = log.match(/IP:\s*([\d.:a-fA-F]+)/);
        this.lastDesktop = ipMatch![1]; // Pegando apenas o IP  
        console.log(this.lastDesktop)    
          this.requestLastDesktop = this.logs.filter(l => l.includes(this.lastDesktop)).length;
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
      this.updateChart()
    });
  }


  updateChart() {
    this.radialOption = { ...this.radialOption, series: [{ ...this.radialOption.series[0], data: [
      { value: this.requestCount, name: 'Search Engine' },
      { value: 10, name: 'Direct' }
    ] }]};
    this.mobile = { ...this.mobile, series: [{ ...this.mobile.series[0], data: [
      { value: this.requestLastMobile, name: 'Search Engine' },
      { value: 10, name: 'Direct' }
    ] }]};
    this.desktop = { ...this.desktop, series: [{ ...this.desktop.series[0], data: [
      { value: this.requestLastDesktop, name: 'Search Engine' },
      { value: 10, name: 'Direct' }
    ] }]};
  }
}
