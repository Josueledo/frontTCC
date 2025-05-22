import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { LogMonitorComponent } from '../log-monitor/log-monitor.component';
import { BlockedsComponent } from '../blockeds/blockeds.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MenuComponent, LogMonitorComponent, BlockedsComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  activeComponent: string = 'log-monitor'; // começa com log-monitor ou vazio se quiser

  onComponentChange(component: string) {
    this.activeComponent = component;
  }
}
