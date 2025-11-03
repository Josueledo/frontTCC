import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { LogMonitorComponent } from '../log-monitor/log-monitor.component';
import { BlockedsComponent } from '../blockeds/blockeds.component';
import { CommonModule } from '@angular/common';
import { HelpComponent } from "../help/help.component";
import { SettingsComponent } from "../settings/settings.component";
import { LogService } from '../services/log.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MenuComponent, LogMonitorComponent, BlockedsComponent, CommonModule, HelpComponent, SettingsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  activeComponent: string = 'log-monitor'; // começa com log-monitor ou vazio se quiser
  public serverStatus: 'online' | 'offline' = 'offline';


    constructor(private logService: LogService) {}
  

  onComponentChange(component: string) {
    this.activeComponent = component;
  }
  
  ngOnInit(){
     this.logService.checkServerStatus().subscribe(status => {
          this.serverStatus = status;
        });
    
        // Opcional: Verificar a cada 10 segundos
        interval(10000).subscribe(() => {
          this.logService.checkServerStatus().subscribe(status => {
            this.serverStatus = status;
          });
        });
      }
}
