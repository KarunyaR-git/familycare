import { Component, Input } from '@angular/core';
import { CreateOrUpdateReminderResponse } from '../../../core/models/reminder-response.model';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button-component/button-component';
import { DropdownComponent } from '../../../shared/components/dropdown-component/dropdown-component';
import { InputComponent } from '../../../shared/components/input-component/input-component';
import { DateTimeComponent } from '../../../shared/components/date-time-component/date-time-component';

@Component({
  selector: 'app-reminder-form-component',
  imports: [ReactiveFormsModule, ButtonComponent, DropdownComponent, InputComponent, DateTimeComponent],
  templateUrl: './reminder-form-component.html',
  styleUrl: './reminder-form-component.css',
})
export class ReminderFormComponent {
  @Input() reminderData:CreateOrUpdateReminderResponse|null = null;
  @Input() mode = 'add';

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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.reminderForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      reminderAt: ['', Validators.required],
      reminderBefore: [60],
      status: ['pending']
    });
    if(this.mode === 'edit') {
      this.loadData();
    } else {
      this.reminderForm.get('status')?.setValue("pending");
    }
  }

  loadData() {
    this.reminderForm.patchValue({
      title: this.reminderData?.title,
      description: this.reminderData?.description || '',
      reminderAt: this.reminderData?.reminderAt,
      reminderBefore: this.reminderData?.reminderBefore,
      status: this.reminderData?.status
    })
  }

  getErrorMessage(controlName: string): string {
    const control = this.reminderForm.get(controlName);
    if (!control || !control.touched || !control.errors) {
      return '';
    }
    if (control.errors['required']) {
      return `${this.getFieldLabel(controlName)} is required`;
    }
    if (control.errors['emailInvalid']) {
      return 'Enter a valid email address';
    }
    if (control.errors['minlength']) {
      const requiredLength = control.errors['minlength'].requiredLength;
      return `Minimum ${requiredLength} characters required`;
    }
    if (control.errors['min']) {
      return 'Age cannot be less than 0';
    }
    if (control.errors['max']) {
      return 'Age cannot be greater than 120';
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

  onCancel() {}
}
