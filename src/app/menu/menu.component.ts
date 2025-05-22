import { Component, Output,EventEmitter } from '@angular/core';
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
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { LogService } from '../services/log.service';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  faMobile = faMobile;
  faGear = faGear;
  faDesktop = faDesktop;
  faQuestion = faQuestion;
  faFile = faFile;
  faLayerGroup = faLayerGroup;
  faBell = faBell;
  faExpand = faExpand;
  faLock= faLock


  selectedItem: string = 'log-monitor';

  @Output() componentChange = new EventEmitter<string>();


  constructor(private logService: LogService) {}

  changeComponent(component: string) {
    console.log(component)
    this.selectedItem = component;
    this.componentChange.emit(component);
  }

  downloadLogs() {
    const logs = this.logService.getAllLogs();
    const content = logs.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'logs.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  }

}
