import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VaccinationResponse } from '../../../core/models/vaccination.model';
import { VaccinationService } from '../../../core/services/vaccination-service';
import { NotificationService } from '../../../core/services/notification-service';
import { SelectedBabyService } from '../../../core/services/selected-baby-service';
import { toDateTimeLocal } from '../../../shared/utils/toDateTimeLocal';
import { getErrorMessage } from '../../../shared/utils/error-handler';
import { ButtonComponent } from '../../../shared/components/button-component/button-component';
import { DateTimeComponent } from '../../../shared/components/date-time-component/date-time-component';
import { InputComponent } from '../../../shared/components/input-component/input-component';
import { ModalComponent } from '../../../shared/components/modal-component/modal-component';
import { TextareaComponent } from '../../../shared/components/textarea-component/textarea-component';

@Component({
  selector: 'app-vaccination-form-component',
  imports: [ReactiveFormsModule, ButtonComponent, DateTimeComponent, ModalComponent, TextareaComponent, InputComponent],
  templateUrl: './vaccination-form-component.html',
  styleUrl: './vaccination-form-component.css',
})
export class VaccinationFormComponent implements OnInit{
  vaccinationForm!: FormGroup;
  isLoading = signal(false);
  
  constructor(
    private fb: FormBuilder, 
    private dialogRef: MatDialogRef<VaccinationFormComponent>,  
    @Inject(MAT_DIALOG_DATA)
    public data: {
      mode: 'create' | 'edit';
      vaccination?: VaccinationResponse;
      babyId?: string;
    },
    private vaccinationService: VaccinationService,
    private notificationService: NotificationService,
    private selectedBabyService: SelectedBabyService
  ) {}

  ngOnInit(): void {
    this.vaccinationForm = this.fb.group({
      name: [null , [Validators.required]],
      doseNumber: [null , [Validators.required, Validators.min(1)]],
      vaccineAt: ['', [Validators.required]],
      notes: ['']
    });
    if(this.data.mode === 'edit') {
      this.loadData();
    }
  }


  loadData() {
    const vaccination = this.data.vaccination;

    if (!vaccination) {
      return;
    }

    this.vaccinationForm.patchValue({
      name: vaccination.name,
      doseNumber: vaccination.doseNumber,
      vaccineAt: toDateTimeLocal(vaccination.vaccineAt),
      notes: vaccination.notes
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.vaccinationForm.get(controlName);
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
      name: 'Name',
      doseNumber: 'Dose Number',
      notes: 'Notes',
      vaccineAt: 'Vaccine At'
    };

    return labels[controlName] ?? controlName;
  }

  onSubmit() {
    if (this.vaccinationForm.invalid) {
      this.vaccinationForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);

    const formValue = this.vaccinationForm.value;
    const baby = this.selectedBabyService.selectedBabyValue();

    const babyId = baby?.id ?? this.data.babyId;

    if (!babyId) {
      this.notificationService.error('Please select a baby');
      this.isLoading.set(false);
      return;
    }
    const body = {
      ...formValue,
      vaccineAt: new Date(formValue.vaccineAt).toISOString(),
      babyId
    };

    if(this.data.mode === "create") {
      this.vaccinationService.createVaccination(body).subscribe({
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
      this.vaccinationService.updateVaccination((this.data.vaccination?._id || ''), body).subscribe({
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
    return !this.vaccinationForm.valid || this.isLoading() || this.vaccinationForm.pristine
  }
}

