import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);
  private duration = 3000
  private horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  private verticalPosition: MatSnackBarVerticalPosition = 'top';

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  private show(message: string, type: NotificationType): void {

    const className = `snackbar-${type}`;

    console.log(className);   // <-- what does this print?

    this.snackBar.open(message, 'Close', {
      duration: this.duration,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: className
    });
  }
//   private show(message: string, type: NotificationType): void {
//   const ref = this.snackBar.open(message, 'Close', {
//     duration: this.duration,
//     horizontalPosition: this.horizontalPosition,
//     verticalPosition: this.verticalPosition,
//     panelClass: 'snackbar-success'
//   });

//   console.log(ref);
// }
}
