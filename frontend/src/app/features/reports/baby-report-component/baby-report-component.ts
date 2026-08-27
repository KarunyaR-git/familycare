import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../../../core/services/home-service';
import { BabyReport } from '../../../core/models/home-dasboard-response.model';
import { NotificationService } from '../../../core/services/notification-service';
import { getErrorMessage } from '../../../shared/utils/error-handler';
import { BabySummary } from '../../../core/models/baby-summary.model';
import { DropdownComponent } from '../../../shared/components/dropdown-component/dropdown-component';
import { DatePipe } from '@angular/common';
import { SkeletonComponent } from '../../../shared/components/skeleton-component/skeleton-component';
import { FormatMinutesPipe } from '../../../shared/pipes/formatMinutes.pipe';

@Component({
  selector: 'app-baby-report-component',
  imports: [FormsModule, MatIconModule, DropdownComponent, DatePipe, SkeletonComponent, FormatMinutesPipe],
  templateUrl: './baby-report-component.html',
  styleUrl: './baby-report-component.css',
})
export class BabyReportComponent implements OnInit {
  loading = signal(false);
  reportDetails: BabyReport | null = null;
  selectedBaby:BabySummary | null = null;
  selectedPeriod = signal("today");
  periodList = [
    {label: 'Today', value: 'today'},
    {label: 'Last 7 Days', value: '7'},
    {label: 'Last 30 Days', value: '30'}
  ]
  periodDates: {
  startDate: Date | null;
  endDate: Date | null;
  } = {
    startDate: null,
    endDate: null
  };
  constructor(private router: Router, private homeService: HomeService, private route: ActivatedRoute, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadReportDetails()
    this.formatDates()
  }

  loadReportDetails() {
    this.loading.set(true);
    const babyId = this.route.snapshot.paramMap.get('babyId');
    if (!babyId) {
      this.loading.set(false);
      this.onBackToHome();
      return;
    }
    this.homeService.getBabyReport(babyId, this.selectedPeriod()).subscribe({
      next: (response: BabyReport) => {
        this.reportDetails = response;
        this.selectedBaby = response.baby
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.notificationService.error(getErrorMessage(error));
      }
    })
  }

  formatDates() {
    const period = this.selectedPeriod();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let startDate = new Date(today);
    const displayEndDate = new Date(today);

    if (period === '7') {
      startDate.setDate(startDate.getDate() - 6);
    } else if (period === '30') {
      startDate.setDate(startDate.getDate() - 29);
    }

    this.periodDates = {
      startDate,
      endDate: displayEndDate
    };
  }

  onPeriodChange(period: string) {
    this.selectedPeriod.set(period);
    this.formatDates()
    this.loadReportDetails();
  }

  onBackToHome() {
    this.router.navigate(['/home']);
  }
}
