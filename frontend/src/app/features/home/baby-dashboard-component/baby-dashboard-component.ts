import { Component, EventEmitter, Input, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { HomeDashboardBabyDetails } from '../../../core/models/home-dasboard-response.model';
import { BabySummary } from '../../../core/models/baby-summary.model';
import { DropdownComponent, DropdownOption } from '../../../shared/components/dropdown-component/dropdown-component';
import { mapDropdownOptions } from '../../../shared/utils/dropdown-options-helper';
import { SelectedBabyService } from '../../../core/services/selected-baby-service';
import { FormsModule } from '@angular/forms';
import { QuickActionsComponent } from '../quick-actions-component/quick-actions-component';
import { BabySummaryComponent } from '../baby-summary-component/baby-summary-component';
import { LatestActivitiesComponent } from '../latest-activities-component/latest-activities-component';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BabyFormComponent } from '../../babies/baby-form-component/baby-form-component';
import { BabyService } from '../../../core/services/baby-service';
import { NotificationService } from '../../../core/services/notification-service';
import { getErrorMessage } from '../../../shared/utils/error-handler';
import { BabyResponse } from '../../../core/models/baby.model';

@Component({
  selector: 'app-baby-dashboard-component',
  imports: [DropdownComponent, FormsModule, QuickActionsComponent, BabySummaryComponent, LatestActivitiesComponent, MatIconModule],
  templateUrl: './baby-dashboard-component.html',
  styleUrl: './baby-dashboard-component.css',
})

export class BabyDashboardComponent implements OnInit, OnChanges{
  @Input() details: HomeDashboardBabyDetails | null = null;
  @Input() babies: BabySummary[] = [];
  @Output() babyChanged = new EventEmitter<string>();
  @Output() refreshdashboard = new EventEmitter<void>();
  @Output() babyDetailsUpdated = new EventEmitter<any>();
  
  babiesLists:DropdownOption[] = [];
  selectedBabyId: string | null = '';

  constructor(private selectedBabyService: SelectedBabyService, private router: Router, private dialog: MatDialog, private babyService: BabyService, private notificationService: NotificationService) {}

  ngOnInit() {
    this.selectedBabyId = this.selectedBabyService.selectedBabyValue()?.id || '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['babies']) {
      this.babiesLists = mapDropdownOptions(this.babies);
      this.selectedBabyId = this.selectedBabyService.selectedBabyValue()?.id || '';
    }
  }

  onBabyChange(babyId: string): void {
    this.selectedBabyId = babyId;

    const selectedBaby = this.babies.find(
      baby => baby.id === babyId
    );

    if (selectedBaby) {
      this.selectedBabyService.setSelectedBaby(selectedBaby);
    }

    this.babyChanged.emit(babyId);
  }

  onViewReports(): void {
    if (!this.selectedBabyId) return;

    this.router.navigate(['/home', this.selectedBabyId, 'reports']);
  }

  onViewTodayActivities(): void {
    this.router.navigate(['/home/activities', this.selectedBabyId]);
  }

  onDashboardRefresh() {
    this.refreshdashboard.emit();
  }

  onEditBaby() {
    let baby = {};    
    this.babyService.getBaby(this.selectedBabyId || '').subscribe({
      next: (response) => {
        baby = response;
        const dialogRef = this.dialog.open(BabyFormComponent, {
          disableClose: true,
          data: {
            mode: "edit",
            baby
          }
        });

        dialogRef.afterClosed().subscribe((response:any) => {      
          if(response?.mode === "updated") {
            this.babyDetailsUpdated.emit(response);        
          } else if(response?.mode === "deleted") {
            this.babyDetailsUpdated.emit(response);
          }
        });
      },
      error: (error) => {
        this.notificationService.error(getErrorMessage(error));
      }
    }) 
  }
}
