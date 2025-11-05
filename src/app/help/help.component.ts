import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss'
})
export class HelpComponent {
  // Lista de perguntas separadas por categoria
  faqs = {
    generalReport: [
      {
        question: 'How often are reports updated?',
        answer: 'Reports are updated in real time as new data is collected and analyzed.',
        open: false
      },
      {
        question: 'Can I export security reports?',
        answer: 'Yes. In the “General Report” section, click Export Report to download a summary in CSV or PDF format.',
        open: false
      },
      {
        question: 'Can I customize the report filters?',
        answer: 'Yes. You can filter by date, IP address, or event type to view specific information.',
        open: false
      }
    ],
    blockedIps: [
      {
        question: 'How can I unblock an IP?',
        answer: 'Go to the “Blocked IPs” tab, find the IP you want to unblock, and click Unblock.',
        open: false
      },
      {
        question: 'What happens after I unblock an IP?',
        answer: 'Once unblocked, the IP regains system access, but monitoring continues to detect future threats.',
        open: false
      },
      {
        question: 'Can I export the list of blocked IPs?',
        answer: 'Yes. You can export the current list for auditing or investigation purposes.',
        open: false
      }
    ]
  };

  toggleFaq(section: 'generalReport' | 'blockedIps', index: number) {
    this.faqs[section][index].open = !this.faqs[section][index].open;
  }
}
