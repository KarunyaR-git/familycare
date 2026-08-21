import { Component, Inject, OnInit, signal } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal-component/modal-component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button-component/button-component';
import { DateTimeComponent } from '../../../shared/components/date-time-component/date-time-component';
import { DropdownComponent } from '../../../shared/components/dropdown-component/dropdown-component';
import { TextareaComponent } from '../../../shared/components/textarea-component/textarea-component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DiaperResponse } from '../../../core/models/diaper.model';
import { DiaperService } from '../../../core/services/diaper-service';
import { NotificationService } from '../../../core/services/notification-service';
import { toDateTimeLocal } from '../../../shared/utils/toDateTimeLocal';
import { getErrorMessage } from '../../../shared/utils/error-handler';
import { SelectedBabyService } from '../../../core/services/selected-baby-service';
import { BabySummary } from '../../../core/models/baby-summary.model';

@Component({
  selector: 'app-diaper-form-component',
  imports: [ReactiveFormsModule, ButtonComponent, DropdownComponent, DateTimeComponent, ModalComponent, TextareaComponent],
  templateUrl: './diaper-form-component.html',
  styleUrl: './diaper-form-component.css',
})
export class DiaperFormComponent implements OnInit{
  diaperForm!: FormGroup;
  typeLists = [
    {
      label: "Wet",
      value: "wet"
    },
    {
      label: "Dirty",
      value: "dirty"
    },
    {
      label: "Both",
      value: "both"
    }
  ];
  isLoading = signal(false);
  
  constructor(
    private fb: FormBuilder, 
    private dialogRef: MatDialogRef<DiaperFormComponent>,  
    @Inject(MAT_DIALOG_DATA)
    public data: {
      mode: 'create' | 'edit';
      diaper?: DiaperResponse;
    },
    private diaperService: DiaperService,
    private notificationService: NotificationService,
    private selectedBabyService: SelectedBabyService
  ) {}

  ngOnInit(): void {
    this.diaperForm = this.fb.group({
      type: ['', Validators.required],
      changedAt: ['', Validators.required],
      notes: ['']
    });
    if(this.data.mode === 'edit') {
      this.loadData();
    }
  }


  loadData() {
    const diaper = this.data.diaper;

    if (!diaper) {
      return;
    }

    this.diaperForm.patchValue({
      type: diaper.type,
      changedAt: toDateTimeLocal(diaper.changedAt),
      notes: diaper.notes
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.diaperForm.get(controlName);
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
      type: 'Type',
      notes: 'Notes',
      changedAt: 'Changed At'
    };

    return labels[controlName] ?? controlName;
  }

  onSubmit() {
    if (this.diaperForm.invalid) {
      this.diaperForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);

    const formValue = this.diaperForm.value;
    const baby = this.selectedBabyService.selectedBabyValue();

    if (!baby) {
      this.notificationService.error('Please select a baby');
      this.isLoading.set(false);
      return;
    }
    const body = {
      ...formValue,
      changedAt: new Date(formValue.changedAt).toISOString(),
      babyId: baby.id
    };

    if(this.data.mode === "create") {
      this.diaperService.createDiaper(body).subscribe({
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
      this.diaperService.updateDiaper((this.data.diaper?._id || ''), body).subscribe({
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
    return !this.diaperForm.valid || this.isLoading()
  }
}
