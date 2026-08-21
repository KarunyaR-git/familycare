import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BabyResponse } from '../../../core/models/baby.model';
import { BabyService } from '../../../core/services/baby-service';
import { NotificationService } from '../../../core/services/notification-service';
import { SelectedBabyService } from '../../../core/services/selected-baby-service';
import { toDateTimeLocal } from '../../../shared/utils/toDateTimeLocal';
import { getErrorMessage } from '../../../shared/utils/error-handler';
import { ButtonComponent } from '../../../shared/components/button-component/button-component';
import { DateTimeComponent } from '../../../shared/components/date-time-component/date-time-component';
import { DropdownComponent } from '../../../shared/components/dropdown-component/dropdown-component';
import { ModalComponent } from '../../../shared/components/modal-component/modal-component';
import { TextareaComponent } from '../../../shared/components/textarea-component/textarea-component';
import { InputComponent } from '../../../shared/components/input-component/input-component';

@Component({
  selector: 'app-baby-form-component',
  imports: [ReactiveFormsModule, ButtonComponent, DropdownComponent, DateTimeComponent, ModalComponent, InputComponent],
  templateUrl: './baby-form-component.html',
  styleUrl: './baby-form-component.css',
})
export class BabyFormComponent implements OnInit{
  babyForm!: FormGroup;
  genderLists = [
    {
      label: "Boy",
      value: "boy"
    },
    {
      label: "Girl",
      value: "girl"
    }
  ];
  bloodGroupLists = [
    {
      label: "A+",
      value: "A+"
    },
    {
      label: "A-",
      value: "A-"
    },
    {
      label: "B+",
      value: "B+"
    },
    {
      label: "B-",
      value: "B-"
    },
    {
      label: "O+",
      value: "O+"
    },
    {
      label: "O-",
      value: "O-"
    },
    {
      label: "AB+",
      value: "AB+"
    },
    {
      label: "AB-",
      value: "AB-"
    }
  ];
  isLoading = signal(false);
  
  constructor(
    private fb: FormBuilder, 
    private dialogRef: MatDialogRef<BabyFormComponent>,  
    @Inject(MAT_DIALOG_DATA)
    public data: {
      mode: 'create' | 'edit';
      baby?: BabyResponse;
    },
    private babyService: BabyService,
    private notificationService: NotificationService,
    private selectedBabyService: SelectedBabyService
  ) {}

  ngOnInit(): void {
    this.babyForm = this.fb.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      bloodGroup: ['']
    });
    if(this.data.mode === 'edit') {
      this.loadData();
    }
  }


  loadData() {
    const baby = this.data.baby;

    if (!baby) {
      return;
    }

    this.babyForm.patchValue({
      name: baby.name,
      gender: baby.gender,
      dob: toDateTimeLocal(baby.dob),
      bloodGroup: baby.bloodGroup
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.babyForm.get(controlName);
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
      name: 'Name',
      gender: 'Gender',
      dob: 'DOB',
      bloodGroup: 'Blood Group'
    };

    return labels[controlName] ?? controlName;
  }

  onSubmit() {
    if (this.babyForm.invalid) {
      this.babyForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);

    const body = this.babyForm.value;

    if(this.data.mode === "create") {
      this.babyService.createBaby(body).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.notificationService.success('Created Successfully!');
        const response = {
          mode: "created",
          newBaby: res
        }
        this.dialogRef.close(response);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.notificationService.error(getErrorMessage(error));
      }
    });
    } else {
      this.babyService.updateBaby((this.data.baby?._id || ''), body).subscribe({
        next: (res) => {          
          this.isLoading.set(false);
          const response = {
          mode: "updated",
          baby: res
        }
        this.dialogRef.close(response);
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
    return !this.babyForm.valid || this.isLoading()
  }
}
