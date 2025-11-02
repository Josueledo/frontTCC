import { Component, inject } from '@angular/core';
import { LogService } from '../services/log.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blockeds',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blockeds.component.html',
  styleUrl: './blockeds.component.scss',
})
export class BlockedsComponent {
  logService = inject(LogService);
  blockedIPs:any = ''

  ngOnInit(): void {
    this.logService.blockedIPs$.subscribe((ipsSet) => {
      this.blockedIPs = Array.from(ipsSet); // converte Set em array para usar no HTML
    });
  }
}
