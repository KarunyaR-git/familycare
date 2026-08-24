import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button-component/button-component';
import { DateTimeComponent } from '../../../shared/components/date-time-component/date-time-component';
import { DropdownComponent } from '../../../shared/components/dropdown-component/dropdown-component';
import { ModalComponent } from '../../../shared/components/modal-component/modal-component';
import { TextareaComponent } from '../../../shared/components/textarea-component/textarea-component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FeedingResponse } from '../../../core/models/feeding.model';
import { FeedingService } from '../../../core/services/feeding-service';
import { NotificationService } from '../../../core/services/notification-service';
import { SelectedBabyService } from '../../../core/services/selected-baby-service';
import { toDateTimeLocal } from '../../../shared/utils/toDateTimeLocal';
import { getErrorMessage } from '../../../shared/utils/error-handler';
import { InputComponent } from '../../../shared/components/input-component/input-component';

@Component({
  selector: 'app-feeding-form-component',
  imports: [ReactiveFormsModule, ButtonComponent, DropdownComponent, DateTimeComponent, ModalComponent, TextareaComponent, InputComponent],
  templateUrl: './feeding-form-component.html',
  styleUrl: './feeding-form-component.css',
})
export class FeedingFormComponent implements OnInit{
  feedingForm!: FormGroup;
  typeLists = [
    {
      label: "Breastfeeding",
      value: "breastfeeding"
    },
    {
      label: "Formula",
      value: "formula"
    },
    {
      label: "Solid",
      value: "solid"
    },
    {
      label: "Water",
      value: "water"
    },
    {
      label: "Other",
      value: "other"
    }
  ];
  unitLists = [
    {
      label: "ml",
      value: "ml"
    },
    {
      label: "oz",
      value: "oz"
    },
    {
      label: "gram",
      value: "gram"
    },
    {
      label: "spoon",
      value: "spoon"
    },
    {
      label: "piece",
      value: "piece"
    },
    {
      label: "serving",
      value: "serving"
    },
    {
      label: "other",
      value: "other"
    }
  ];
  breastfeedingSideLists = [
    {
      label: "Left",
      value: "left"
    },
    {
      label: "Right",
      value: "right"
    },
    {
      label: "Both",
      value: "both"
    }
  ];
  isLoading = signal(false);
  
  constructor(
    private fb: FormBuilder, 
    private dialogRef: MatDialogRef<FeedingFormComponent>,  
    @Inject(MAT_DIALOG_DATA)
    public data: {
      mode: 'create' | 'edit';
      feeding?: FeedingResponse;
    },
    private feedingService: FeedingService,
    private notificationService: NotificationService,
    private selectedBabyService: SelectedBabyService
  ) {}

  ngOnInit(): void {
    this.feedingForm = this.fb.group({
      type: ['', Validators.required],
      feedingAt: ['', Validators.required],
      foodName: [null],
      quantity: [null],
      unit: [null],
      duration: [null],
      breastfeedingSide: [null],
      notes: [null]
    });
    if(this.data.mode === 'edit') {
      this.loadData();
    }

    this.feedingForm.get('type')?.valueChanges.subscribe(() => {
      this.onTypeChange();
    });
  }


  loadData() {
    const feeding = this.data.feeding;

    if (!feeding) {
      return;
    }

    this.feedingForm.patchValue({
      type: feeding.type,
      feedingAt: toDateTimeLocal(feeding.feedingAt),
      notes: feeding.notes
    });
    if(feeding.type === "breastfeeding") {
      this.feedingForm.patchValue({      
        duration: feeding.duration,
        breastfeedingSide: feeding.breastfeedingSide
      });
    } else if(feeding.type === "formula" || feeding.type === "water" || feeding.type === "other") {
      this.feedingForm.patchValue({      
        quantity: feeding.quantity,
        unit: feeding.unit,
      }); 
    }  else if(feeding.type === "solid") {
      this.feedingForm.patchValue({      
        foodName: feeding.foodName,
        quantity: feeding.quantity,
        unit: feeding.unit,
      });
    }
    this.setValidators();
  }

  onTypeChange() {
    this.removeValidators();
    
    this.feedingForm.patchValue({
      duration: null,
      breastfeedingSide: null,
      foodName: null,
      quantity: null,
      unit: null
    });

    this.setValidators();  
  }

  removeValidators() {
    const conditionalControls = [
      'foodName',
      'quantity',
      'unit',
      'duration',
      'breastfeedingSide'
    ];

    conditionalControls.forEach(controlName => {
      const control = this.feedingForm.get(controlName);

      control?.clearValidators();
      control?.updateValueAndValidity({ emitEvent: false });
    });
  }

  setValidators() {
    const type = this.feedingForm.get('type')?.value;
    if(type === "breastfeeding") {
      this.feedingForm.get('duration')?.setValidators([
        Validators.required,
        Validators.min(1)
      ]);
      this.feedingForm.get('breastfeedingSide')?.setValidators([
        Validators.required
      ]);
    } else if(type === "formula" || type === "water") {
      this.feedingForm.get('quantity')?.setValidators([
        Validators.required,
        Validators.min(0.1)
      ]);
      this.feedingForm.get('unit')?.setValidators([
        Validators.required
      ]);
    } else if(type === "solid") {
      this.feedingForm.get('foodName')?.setValidators([
        Validators.required
      ]);
      this.feedingForm.get('quantity')?.setValidators([
        Validators.required,
        Validators.min(0.1)
      ]);
      this.feedingForm.get('unit')?.setValidators([
        Validators.required
      ]);
    } else {
      this.feedingForm.get('quantity')?.setValidators([
        Validators.min(0.1)
      ]);
    }

    [
      'foodName',
      'quantity',
      'unit',
      'duration',
      'breastfeedingSide'
    ].forEach(controlName => {
      this.feedingForm.get(controlName)?.updateValueAndValidity({ emitEvent: false });
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.feedingForm.get(controlName);
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
      type: 'Type',
      notes: 'Notes',
      feedingAt: 'Feeding At',
      foodName: 'Food Name',
      quantity: 'Quantity',
      unit: 'Unit',
      duration: 'Duration',
      breastfeedingSide: 'Breastfeeding Side'
    };

    return labels[controlName] ?? controlName;
  }

  onSubmit() {
    if (this.feedingForm.invalid) {
      this.feedingForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);

    const formValue = this.feedingForm.value;
    const baby = this.selectedBabyService.selectedBabyValue();

    if (!baby) {
      this.notificationService.error('Please select a baby');
      this.isLoading.set(false);
      return;
    }
    const body = {
      ...formValue,
      feedingAt: new Date(formValue.feedingAt).toISOString(),
      babyId: baby.id
    };

    if(this.data.mode === "create") {
      this.feedingService.createFeeding(body).subscribe({
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
      this.feedingService.updateFeeding((this.data.feeding?._id || ''), body).subscribe({
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
    return !this.feedingForm.valid || this.isLoading()
  }

  get feedingType() {
    const formControl = this.feedingForm?.get('type') as FormControl;
    return formControl.value;
  }
}

