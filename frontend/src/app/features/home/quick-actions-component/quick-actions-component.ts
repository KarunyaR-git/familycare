import { Component, EventEmitter, Output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DiaperFormComponent } from '../../diapers/diaper-form-component/diaper-form-component';
import { GrowthFormComponent } from '../../growth/growth-form-component/growth-form-component';
import { VaccinationFormComponent } from '../../vaccinations/vaccination-form-component/vaccination-form-component';
import { FeedingFormComponent } from '../../feedings/feeding-form-component/feeding-form-component';
import { SleepFormComponent } from '../../sleeps/sleep-form-component/sleep-form-component';

@Component({
  selector: 'app-quick-actions-component',
  imports: [MatChipsModule, MatIconModule],
  templateUrl: './quick-actions-component.html',
  styleUrl: './quick-actions-component.css',
})
export class QuickActionsComponent {
  @Output() dashboardRefresh = new EventEmitter<void>();
  
  quickActions = [
    { label: 'Sleep', icon: 'bedtime', key: 'sleep' },
    { label: 'Wake Up', icon: 'wb_sunny', key: 'wakeup' },
    { label: 'Feeding', icon: 'restaurant', key: 'feeding' },
    { label: 'Diaper', icon: 'baby_changing_station', key: 'diaper' },
    { label: 'Vaccination', icon: 'vaccines', key: 'vaccination' },
    { label: 'Growth', icon: 'monitoring', key: 'growth' }
  ];

  constructor(private dialog: MatDialog) {}

  onQuickActionClick(actionKey: string) {
    if(actionKey === "sleep" || actionKey === "wakeup") {
      this.addSleepOrWakeUp(actionKey);
    } else if(actionKey === "feeding") {
      this.addFeeding();
    } else if(actionKey === "diaper") {
      this.addDiaper();
    } else if(actionKey === "growth") {
      this.addGrowth();
    } else if(actionKey === "vaccination") {
      this.addVaccination();
    } 
  }

  addSleepOrWakeUp(action: string) {
    const dialogRef = this.dialog.open(SleepFormComponent, {
      disableClose: true,
      data: {
        mode: "create",
        action
      }
    });

    dialogRef.afterClosed().subscribe((created) => {
      if(created === "created") {
        this.dashboardRefresh.emit();
      }
    });
  }

  addFeeding() {
    const dialogRef = this.dialog.open(FeedingFormComponent, {
      disableClose: true,
      data: {
        mode: "create"
      }
    });

    dialogRef.afterClosed().subscribe((created) => {
      if(created === "created") {
        this.dashboardRefresh.emit();
      }
    });
  }

  addDiaper() {
    const dialogRef = this.dialog.open(DiaperFormComponent, {
      disableClose: true,
      data: {
        mode: "create"
      }
    });

    dialogRef.afterClosed().subscribe((created) => {
      if(created === "created") {
        this.dashboardRefresh.emit();
      }
    });
  }

  addGrowth() {
    const dialogRef = this.dialog.open(GrowthFormComponent, {
      disableClose: true,
      data: {
        mode: "create"
      }
    });

    dialogRef.afterClosed().subscribe((created) => {
      if(created === "created") {
        this.dashboardRefresh.emit();
      }
    });
  }

  addVaccination() {
    const dialogRef = this.dialog.open(VaccinationFormComponent, {
      disableClose: true,
      data: {
        mode: "create"
      }
    });

    dialogRef.afterClosed().subscribe((created) => {
      if(created === "created") {
        this.dashboardRefresh.emit();
      }
    });
  }
}
