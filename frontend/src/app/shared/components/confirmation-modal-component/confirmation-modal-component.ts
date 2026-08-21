import { Component, Inject } from '@angular/core';
import { ModalComponent } from '../modal-component/modal-component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent } from '../button-component/button-component';

@Component({
  selector: 'app-confirmation-modal-component',
  imports: [ModalComponent, ButtonComponent],
  templateUrl: './confirmation-modal-component.html',
  styleUrl: './confirmation-modal-component.css',
})
export class ConfirmationModalComponent {
  constructor(private dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      message: string;
      confirmText: string;
      cancelText: string;
    }
  ) {}

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close("confirmed");
  }
}
