import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GrowthService } from '../../../core/services/growth-service';
import { GrowthResponse } from '../../../core/models/growth.model';
import { NotificationService } from '../../../core/services/notification-service';
import { SelectedBabyService } from '../../../core/services/selected-baby-service';
import { toDateTimeLocal } from '../../../shared/utils/toDateTimeLocal';
import { getErrorMessage } from '../../../shared/utils/error-handler';
import { InputComponent } from '../../../shared/components/input-component/input-component';
import { ButtonComponent } from '../../../shared/components/button-component/button-component';
import { DateTimeComponent } from '../../../shared/components/date-time-component/date-time-component';
import { DropdownComponent } from '../../../shared/components/dropdown-component/dropdown-component';
import { ModalComponent } from '../../../shared/components/modal-component/modal-component';
import { TextareaComponent } from '../../../shared/components/textarea-component/textarea-component';

@Component({
  selector: 'app-growth-form-component',
  imports: [ReactiveFormsModule, ButtonComponent, DateTimeComponent, ModalComponent, TextareaComponent, InputComponent],
  templateUrl: './growth-form-component.html',
  styleUrl: './growth-form-component.css',
})
export class GrowthFormComponent implements OnInit{
  growthForm!: FormGroup;
  isLoading = signal(false);
  
  constructor(
    private fb: FormBuilder, 
    private dialogRef: MatDialogRef<GrowthFormComponent>,  
    @Inject(MAT_DIALOG_DATA)
    public data: {
      mode: 'create' | 'edit';
      growth?: GrowthResponse;
      babyId?: string;
    },
    private growthService: GrowthService,
    private notificationService: NotificationService,
    private selectedBabyService: SelectedBabyService
  ) {}

  ngOnInit(): void {
    this.growthForm = this.fb.group({
      weight: [null , [Validators.required, Validators.min(1)]],
      height: [null , [Validators.required, Validators.min(10)]],
      measuredAt: ['', [Validators.required]],
      notes: ['']
    });
    if(this.data.mode === 'edit') {
      this.loadData();
    }
  }


  loadData() {
    const growth = this.data.growth;

    if (!growth) {
      return;
    }

    this.growthForm.patchValue({
      weight: growth.weight,
      height: growth.height,
      measuredAt: toDateTimeLocal(growth.measuredAt),
      notes: growth.notes
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.growthForm.get(controlName);
    if (!control || !control.touched || !control.errors) {
      return '';
    }
    if (control.errors['required']) {
      return `${this.getFieldLabel(controlName)} is required`;
    }

    if (control.errors['min']) {
      const minValue = control.errors['min'].min;
      return `${this.getFieldLabel(controlName)} cannot be less than ${minValue}`;
    }
    if (control.errors?.['futureDate']) {
      return `${this.getFieldLabel(controlName)} cannot be in the future`;
    }

    return '';
  }

  private getFieldLabel(controlName: string): string {
    const labels: Record<string, string> = {
      weight: 'Weight',
      height: 'Height',
      notes: 'Notes',
      measuredAt: 'Measured At'
    };

    return labels[controlName] ?? controlName;
  }

  onSubmit() {
    if (this.growthForm.invalid) {
      this.growthForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);

    const formValue = this.growthForm.value;
    const baby = this.selectedBabyService.selectedBabyValue();

    const babyId = baby?.id ?? this.data.babyId;

    if (!babyId) {
      this.notificationService.error('Please select a baby');
      this.isLoading.set(false);
      return;
    }
    const body = {
      ...formValue,
      measuredAt: new Date(formValue.measuredAt).toISOString(),
      babyId
    };

    if(this.data.mode === "create") {
      this.growthService.createGrowth(body).subscribe({
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
      this.growthService.updateGrowth((this.data.growth?._id || ''), body).subscribe({
        next: () => {          
          this.isLoading.set(false);
          this.notificationService.success('Updated Successfully!');
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
    return !this.growthForm.valid || this.isLoading() || this.growthForm.pristine
  }
}
