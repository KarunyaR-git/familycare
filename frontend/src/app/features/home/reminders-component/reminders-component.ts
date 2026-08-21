import { Component, OnInit, signal } from '@angular/core';
import { ReminderService } from '../../../core/services/reminder-service';
import { NotificationService } from '../../../core/services/notification-service';
import { ReminderData, ReminderResponse, UpdateReminderRequest } from '../../../core/models/reminder-response.model';
import { DropdownComponent } from '../../../shared/components/dropdown-component/dropdown-component';
import { FormsModule } from '@angular/forms';
import { getErrorMessage } from '../../../shared/utils/error-handler';
import { DatePipe, NgClass } from '@angular/common';
import { SkeletonComponent } from '../../../shared/components/skeleton-component/skeleton-component';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ModalComponent } from '../../../shared/components/modal-component/modal-component';
import { MatDialog } from '@angular/material/dialog';
import { ReminderFormComponent } from '../../reminders/reminder-form-component/reminder-form-component';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal-component/confirmation-modal-component';

@Component({
  selector: 'app-reminders-component',
  imports: [DropdownComponent, FormsModule, NgClass, SkeletonComponent, MatIconModule, DatePipe],
  templateUrl: './reminders-component.html',
  styleUrl: './reminders-component.css',
})
export class RemindersComponent implements OnInit{
  reminderResponse!:ReminderResponse;
  lists:ReminderData[] = [];
  loading = signal(false);
  options = {
    status: "pending",
    page: 1,
    totalPages: 1,
    sortBy: "reminderAt",
    order: "desc"
  }
  statusLabel: any = {
    pending: "Pending",
    completed: "Completed"
  };
  statusOptions = [
    {
      label: "Pending",
      value: "pending"
    },
    {
      label: "Completed",
      value: "completed"
    }
  ];
  sortByOptions = [
    {
      label: "Title",
      value: "title"
    },
    {
      label: "Status",
      value: "status"
    },
    {
      label: "ReminderAt",
      value: "reminderAt"
    },
    {
      label: "ReminderBefore",
      value: "reminderBefore"
    }
  ];
  orderOptions =  [
    {
      label: "asc",
      value: "asc"
    },
    {
      label: "desc",
      value: "desc"
    }
  ];

  constructor(private reminderService: ReminderService, private notificationService: NotificationService, private router: Router, private dialog: MatDialog) {}

 ngOnInit(): void {
  this.loadReminders();
}

loadReminders(): void {
  this.loading.set(true);

  this.reminderService
    .getAllReminders(
      this.options.status,
      this.options.page,
      this.options.sortBy,
      this.options.order
    )
    .subscribe({
      next: (response: ReminderResponse) => {
        this.reminderResponse = response;
        this.lists = response.data;

        this.options.page = response.page;
        this.options.totalPages = response.totalPages;

        this.loading.set(false);
      },

      error: (error) => {
        this.loading.set(false);
        this.notificationService.error(
          getErrorMessage(error)
        );
      }
    });
} 

  onStatusChange(status: string) {
    this.options.status = status;
    this.options.page = 1;
    this.loadReminders();
  }
  onSortByChange(sortBy: string) {
    this.options.sortBy = sortBy;
    this.loadReminders();
  }
  onOrderChange(order: string) {
    this.options.order = order;
    this.loadReminders();
  }

  onBackToHome() {
    this.router.navigate(["/home"]);
  }

  onEditReminder(reminder:ReminderData) {
    const dialogRef = this.dialog.open(ReminderFormComponent, {
    data: {
      mode: 'edit',
      reminder
    }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'updated') {
        this.loadReminders();
        this.notificationService.success('Updated successfully!');
      }
    });
  }
  onMarkCompleteReminder(reminder:ReminderData) {
    const status = "completed";
    this.updateReminder(reminder._id, {status} )
  }
  onDeleteReminder(reminder:ReminderData) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: {
        title: 'Delete Reminder',
        message: 'Are you sure you want to delete this reminder?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.loading.set(true);
        this.reminderService.deleteReminder(reminder._id).subscribe({
          next: () => {
            this.loadReminders();
            this.notificationService.success('Deleted Successfully!');
          },
          error: (error)=> {
            this.notificationService.error(getErrorMessage(error));
            this.loading.set(false);
          }
        });
      }
    });    
  }

  onClickPreviousPage() {
    this.options.page = this.options.page - 1;
    this.loadReminders();
  }

  onClickNextPage() {
    this.options.page = this.options.page + 1;
    this.loadReminders();
  }

  updateReminder(id: string, body:UpdateReminderRequest) {
    this.loading.set(true);
    this.reminderService.updateReminder(id, body).subscribe({
      next: () => { 
        this.reminderService.pendingCount.update(count => count - 1);       
        this.loadReminders();
        this.notificationService.success('Updated Successfully!');
      },
      error: (error)=> {
        this.notificationService.error(getErrorMessage(error));
        this.loading.set(false);
      }
    })
  }
}
