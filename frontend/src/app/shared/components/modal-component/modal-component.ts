import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-modal-component',
  imports: [MatIconModule],
  templateUrl: './modal-component.html',
  styleUrl: './modal-component.css',
})
export class ModalComponent {
  @Input() title = '';

  constructor(private dialogRef: MatDialogRef<ModalComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
