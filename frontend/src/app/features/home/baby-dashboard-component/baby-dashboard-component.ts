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

@Component({
  selector: 'app-baby-dashboard-component',
  imports: [DropdownComponent, FormsModule, QuickActionsComponent, BabySummaryComponent, LatestActivitiesComponent],
  templateUrl: './baby-dashboard-component.html',
  styleUrl: './baby-dashboard-component.css',
})

export class BabyDashboardComponent implements OnInit, OnChanges{
  @Input() details: HomeDashboardBabyDetails | null = null;
  @Input() babies: BabySummary[] = [];
  @Output() babyChanged = new EventEmitter<string>();
  @Output() refreshdashboard = new EventEmitter<void>();
  
  babiesLists:DropdownOption[] = [];
  selectedBabyId = '';

  constructor(private selectedBabyService: SelectedBabyService, private router: Router) {}

  ngOnInit() {
    this.selectedBabyId = this.selectedBabyService.selectedBabyValue()?.id || '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['babies']) {
      this.babiesLists = mapDropdownOptions(this.babies);
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

  onViewTodayActivities(): void {
    this.router.navigate(['/home/activities']);
  }

  onDashboardRefresh() {
    this.refreshdashboard.emit();
  }
}
