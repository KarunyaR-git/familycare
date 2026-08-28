import { Component, Inject, signal } from '@angular/core';
import { ReminderData } from '../../../core/models/reminder-response.model';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button-component/button-component';
import { DropdownComponent } from '../../../shared/components/dropdown-component/dropdown-component';
import { InputComponent } from '../../../shared/components/input-component/input-component';
import { DateTimeComponent } from '../../../shared/components/date-time-component/date-time-component';
import { ModalComponent } from '../../../shared/components/modal-component/modal-component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TextareaComponent } from '../../../shared/components/textarea-component/textarea-component';
import { toDateTimeLocal } from '../../../shared/utils/toDateTimeLocal';
import { ReminderService } from '../../../core/services/reminder-service';
import { NotificationService } from '../../../core/services/notification-service';
import { getErrorMessage } from '../../../shared/utils/error-handler';

@Component({
  selector: 'app-reminder-form-component',
  imports: [ReactiveFormsModule, ButtonComponent, DropdownComponent, InputComponent, DateTimeComponent, ModalComponent, TextareaComponent],
  templateUrl: './reminder-form-component.html',
  styleUrl: './reminder-form-component.css',
})
export class ReminderFormComponent {

  reminderForm!: FormGroup;
  statusLists = [
    {
      label: "Pending",
      value: "pending"
    },
    {
      label: "Completed",
      value: "completed"
    }
  ]
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder, 
    private dialogRef: MatDialogRef<ReminderFormComponent>,  
    @Inject(MAT_DIALOG_DATA)
    public data: {
      mode: 'create' | 'edit';
      reminder?: ReminderData;
    },
    private reminderService: ReminderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.reminderForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      reminderAt: ['', Validators.required],
      reminderBefore: [60],
      status: ['']
    });
    if(this.data.mode === 'edit') {
      this.loadData();
    } else {
      this.reminderForm.get('status')?.setValue("pending");
    }
  }

  loadData() {
    const reminder = this.data.reminder;

    if (!reminder) {
      return;
    }

    this.reminderForm.patchValue({
      title: reminder.title,
      description: reminder.description ?? '',
      reminderAt: toDateTimeLocal(reminder.reminderAt),
      reminderBefore: reminder.reminderBefore,
      status: reminder.status
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.reminderForm.get(controlName);
    if (!control || !control.touched || !control.errors) {
      return '';
    }
    if (control.errors['required']) {
      return `${this.getFieldLabel(controlName)} is required`;
    }

    return '';
  }

  private getFieldLabel(controlName: string): string {
    const labels: Record<string, string> = {
      title: 'Title',
      description: 'Description',
      reminderAt: 'Reminder At',
      reminderBefore: 'Reminder Before',
      status: 'Status'
    };

    return labels[controlName] ?? controlName;
  }

  onCancel() {
    this.dialogRef.close();
  }
  onSubmit() {
    if (this.reminderForm.invalid) {
    this.reminderForm.markAllAsTouched();
    return;
    }
    this.isLoading.set(true);

    const formValue = this.reminderForm.value;

    const body = {
      ...formValue,
      reminderAt: new Date(formValue.reminderAt).toISOString()
    };
    if(this.data.mode === "create") {
      this.reminderService.createReminder(body).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.dialogRef.close("created");
      },
      error: (error) => {
        this.isLoading.set(false);
        this.notificationService.error(getErrorMessage(error));
      }
    });
    } else {
      this.reminderService.updateReminder((this.data.reminder?._id || ''), body).subscribe({
      next: (response) => {
        if(this.data.reminder?.status !== response.status) {
          if(response.status === 'pending') {
            this.reminderService.pendingCount.update(count => count + 1);
          } else {
            this.reminderService.pendingCount.update(count => count - 1);
          }
        }
        this.isLoading.set(false);
        this.dialogRef.close("updated");
      },
      error: (error) => {
        this.isLoading.set(false);
        this.notificationService.error(getErrorMessage(error));
      }
    });
    }
    
  }

  get isDisabled() {
    return !this.reminderForm.valid || this.isLoading() || this.reminderForm.pristine
  }
}
