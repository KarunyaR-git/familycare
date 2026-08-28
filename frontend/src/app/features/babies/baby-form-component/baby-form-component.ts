import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BabyResponse } from '../../../core/models/baby.model';
import { BabyService } from '../../../core/services/baby-service';
import { NotificationService } from '../../../core/services/notification-service';
import { toDateTimeLocal } from '../../../shared/utils/toDateTimeLocal';
import { getErrorMessage } from '../../../shared/utils/error-handler';
import { ButtonComponent } from '../../../shared/components/button-component/button-component';
import { DateTimeComponent } from '../../../shared/components/date-time-component/date-time-component';
import { DropdownComponent } from '../../../shared/components/dropdown-component/dropdown-component';
import { ModalComponent } from '../../../shared/components/modal-component/modal-component';
import { InputComponent } from '../../../shared/components/input-component/input-component';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal-component/confirmation-modal-component';

@Component({
  selector: 'app-baby-form-component',
  imports: [ReactiveFormsModule, ButtonComponent, DropdownComponent, DateTimeComponent, ModalComponent, InputComponent, MatIconModule],
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
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.babyForm = this.fb.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      bloodGroup: [null]
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
      dob: toDateTimeLocal(baby.dob).split('T')[0],
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

  onDeleteBaby() {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      disableClose: true,
      data: {
        title: 'Delete Baby',
        message: 'Are you sure you want to delete this baby?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.isLoading.set(true);
        this.babyService.deleteBaby(this.data.baby?._id || '').subscribe({
          next: () => {
            this.notificationService.success('Deleted Successfully!');
            this.isLoading.set(false);
            this.dialogRef.close({mode: "deleted"});
          },
          error: (error)=> {
            this.notificationService.error(getErrorMessage(error));
            this.isLoading.set(false);
          }
        });
      }
    }); 
  }
  
  onCancel() {
    this.dialogRef.close();
  }

  get isDisabled() {
    return !this.babyForm.valid || this.isLoading() || this.babyForm.pristine
  }
}
