import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ReminderFormComponent } from '../../reminders/reminder-form-component/reminder-form-component';
import { NotificationService } from '../../../core/services/notification-service';

@Component({
  selector: 'app-family-reminder-component',
  imports: [MatIconModule],
  templateUrl: './family-reminder-component.html',
  styleUrl: './family-reminder-component.css',
})
export class FamilyReminderComponent {
  @Input() count: number = 0;
  @Output() reminderCreated = new EventEmitter<'pending' | 'completed'>();

  constructor(private router: Router, private dialog: MatDialog, private notificationService:NotificationService) {
    
  }
  onAddReminder(): void {
  const dialogRef = this.dialog.open(ReminderFormComponent, {
    data: {
      mode: 'create'
    }
  });

  dialogRef.afterClosed().subscribe((result) => {

    if (result === 'created-pending') {
      this.reminderCreated.emit('pending');
      this.notificationService.success('Created successfully!');
    }

    if (result === 'created-completed') {
      this.reminderCreated.emit('completed');
      this.notificationService.success('Created successfully!');
    }

  });
}

  onViewAllReminders() {
    this.router.navigate(['/home/reminders']);
  }
}
