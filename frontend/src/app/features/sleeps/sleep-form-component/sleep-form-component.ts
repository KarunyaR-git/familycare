import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button-component/button-component';
import { DateTimeComponent } from '../../../shared/components/date-time-component/date-time-component';
import { ModalComponent } from '../../../shared/components/modal-component/modal-component';
import { TextareaComponent } from '../../../shared/components/textarea-component/textarea-component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SleepResponse } from '../../../core/models/sleep.models';
import { SleepService } from '../../../core/services/sleep-service';
import { NotificationService } from '../../../core/services/notification-service';
import { SelectedBabyService } from '../../../core/services/selected-baby-service';
import { toDateTimeLocal } from '../../../shared/utils/toDateTimeLocal';
import { wakeAfterSleepValidator } from '../../../shared/validators/wakeAfterSleep.validator';
import { getErrorMessage } from '../../../shared/utils/error-handler';

@Component({
  selector: 'app-sleep-form-component',
  imports: [ReactiveFormsModule, ButtonComponent, DateTimeComponent, ModalComponent, TextareaComponent],
  templateUrl: './sleep-form-component.html',
  styleUrl: './sleep-form-component.css',
})
export class SleepFormComponent implements OnInit{
  sleepForm!: FormGroup;
  isLoading = signal(false);
  
  constructor(
    private fb: FormBuilder, 
    private dialogRef: MatDialogRef<SleepFormComponent>,  
    @Inject(MAT_DIALOG_DATA)
    public data: {
      mode: 'create' | 'edit';
      action: 'sleep' | 'wakeup' | 'both'
      sleep?: SleepResponse;
    },
    private sleepService: SleepService,
    private notificationService: NotificationService,
    private selectedBabyService: SelectedBabyService
  ) {}

  ngOnInit(): void {
    this.sleepForm = this.fb.group({
      sleptAt: [null],
      sleepNotes: [''],
      wokeUpAt: [null],
      wokeUpNotes: ['']
    });    
    if(this.data.mode === 'edit') {
      this.loadData();
    }
    this.setValidators();
  }


  loadData() {
    const sleep = this.data.sleep;

    if (!sleep) {
      return;
    }

    this.sleepForm.patchValue({
      sleptAt: toDateTimeLocal(sleep.sleptAt || ''),
      sleepNotes: sleep.sleepNotes,
      wokeUpAt: toDateTimeLocal(sleep.wokeUpAt || ''),
      wokeUpNotes: sleep.wokeUpNotes
    });
  }

  setValidators() {
    if(this.data.action === 'sleep') {
      this.sleepForm.get('sleptAt')?.setValidators([Validators.required]);
    } else if(this.data.action === 'wakeup') {
      this.sleepForm.get('wokeUpAt')?.setValidators([Validators.required]);
    } else {
      this.sleepForm.get('sleptAt')?.setValidators([Validators.required]);
      this.sleepForm.get('wokeUpAt')?.setValidators([Validators.required]);
      this.sleepForm.setValidators(wakeAfterSleepValidator);
    }
    this.sleepForm.get('sleptAt')?.updateValueAndValidity();
    this.sleepForm.get('wokeUpAt')?.updateValueAndValidity();
    this.sleepForm.updateValueAndValidity();
  }

  getErrorMessage(controlName: string): string {
    const control = this.sleepForm.get(controlName);
    if (!control || !control.touched || !control.errors) {
      return '';
    }
    if (control.errors['required']) {
      return `${this.getFieldLabel(controlName)} is required`;
    }

    if (controlName === "wokeUpAt" && this.sleepForm.hasError('wakeBeforeSleep')) {
      return 'Wake up time must be after sleep time';
    }

    return '';
  }

  private getFieldLabel(controlName: string): string {
    const labels: Record<string, string> = {
      sleptAt: 'Slept At',
      wokeUpAt: 'WokeUp At'
    };

    return labels[controlName] ?? controlName;
  }  

  onSubmit() {
    if (this.sleepForm.invalid) {
      this.sleepForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);

    const formValue = this.sleepForm.value;
    const baby = this.selectedBabyService.selectedBabyValue();

    if (!baby) {
      this.notificationService.error('Please select a baby');
      this.isLoading.set(false);
      return;
    }
    const body = {
      ...formValue,
      sleptAt: formValue.sleptAt? new Date(formValue.sleptAt).toISOString(): null,
      wokeUpAt: formValue.wokeUpAt? new Date(formValue.wokeUpAt).toISOString(): null,
      babyId: baby.id
    };

    if(this.data.mode === "create") {
      this.sleepService.createSleep(body).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.notificationService.success('Created Successfully!');
        this.dialogRef.close("created");
      },
      error: (error) => {
        this.isLoading.set(false);
        this.notificationService.error(getErrorMessage(error));
      }
    });
    } else {
      this.sleepService.updateSleep((this.data.sleep?._id || ''), body).subscribe({
        next: () => {          
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
  
  onCancel() {
    this.dialogRef.close();
  }

  get isDisabled() {
    return !this.sleepForm.valid || this.isLoading()
  }

  get title() {
    const action = this.data.action === 'wakeup' ? "WakeUp" : "Sleep";
    const mode = this.data.mode === 'create' ? 'Add' : 'Edit';
    return mode + ' ' + action;
  }
}

