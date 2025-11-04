import { Component } from '@angular/core';
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
  faThumbtack,
  faHouseLaptop
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  faMobile = faMobile;
  faDesktop = faDesktop;
  faThumbtack = faThumbtack
  faHouseLaptop = faHouseLaptop
}
