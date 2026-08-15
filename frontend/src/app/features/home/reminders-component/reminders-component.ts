import { Component, OnInit, signal } from '@angular/core';
import { ReminderService } from '../../../core/services/reminder-service';
import { NotificationService } from '../../../core/services/notification-service';
import { ReminderData, ReminderResponse } from '../../../core/models/reminder-response.model';
import { DropdownComponent } from '../../../shared/components/dropdown-component/dropdown-component';
import { FormsModule } from '@angular/forms';
import { getErrorMessage } from '../../../shared/utils/error-handler';
import { DatePipe, NgClass } from '@angular/common';
import { SkeletonComponent } from '../../../shared/components/skeleton-component/skeleton-component';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

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
  statusLabel:any = {
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

  constructor(private reminderService: ReminderService, private notificationService: NotificationService, private router: Router) {}

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

  onEditReminder(reminder:ReminderData) {}
  onMarkCompleteReminder(reminder:ReminderData) {
    //this.options.status = "completed";
  }
  onDeleteReminder(reminder:ReminderData) {}

  onClickPreviousPage() {
    this.options.page = this.options.page - 1;
    this.loadReminders();
  }

  onClickNextPage() {
    this.options.page = this.options.page + 1;
    this.loadReminders();
  }
}
