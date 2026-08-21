import { Component, EventEmitter, Output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DiaperFormComponent } from '../../diapers/diaper-form-component/diaper-form-component';
import { GrowthFormComponent } from '../../growth/growth-form-component/growth-form-component';
import { VaccinationFormComponent } from '../../vaccinations/vaccination-form-component/vaccination-form-component';

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
    if(actionKey === "diaper") {
      this.addDiaper();
    } else if(actionKey === "growth") {
      this.addGrowth();
    } else if(actionKey === "vaccination") {
      this.addVaccination();
    }
  }

  addDiaper() {
    const dialogRef = this.dialog.open(DiaperFormComponent, {
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
