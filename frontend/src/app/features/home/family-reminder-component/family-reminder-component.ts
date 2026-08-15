import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-family-reminder-component',
  imports: [MatIconModule],
  templateUrl: './family-reminder-component.html',
  styleUrl: './family-reminder-component.css',
})
export class FamilyReminderComponent {
  @Input() count: number = 0;

  constructor(private router: Router) {
    
  }
  onAddReminder() {

  }

  onViewAllReminders() {
    this.router.navigate(['/home/reminders']);
  }
}
