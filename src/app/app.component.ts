import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LogMonitorComponent } from './log-monitor/log-monitor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,LogMonitorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontTCC';
}
