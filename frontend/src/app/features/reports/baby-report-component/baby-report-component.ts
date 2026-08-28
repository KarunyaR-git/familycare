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
import { CapitalizePipe } from '../../../shared/pipes/capitalize.pipe';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-baby-report-component',
  imports: [FormsModule, MatIconModule, DropdownComponent, DatePipe, SkeletonComponent, FormatMinutesPipe, CapitalizePipe, BaseChartDirective],
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
  growthChartData: any = {
    labels: [],
    datasets: []
  };
  growthChartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      weight: {
        type: 'linear' as const,
        position: 'left' as const,
        grace: '10%',
        title: {
          display: true,
          text: 'Weight (kg)',
          color: '#4CA6A8'
        }
      },

      height: {
        type: 'linear' as const,
        position: 'right' as const,
        grace: '10%',
        title: {
          display: true,
          text: 'Height (cm)',
          color: '#F4B183'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
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
        this.prepareGrowthChart();
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

  getPercentage(count: number, totalCount: number): number {
    if (totalCount === 0) {
      return 0;
    }

    return (count / totalCount) * 100;
  }

  prepareGrowthChart() {
    const growth = this.reportDetails?.breakdown?.growth || [];

    this.growthChartData = {
      labels: growth.map(item =>
        new Date(item.measuredAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short'
        })
      ),
      datasets: [
        {
          label: 'Weight (kg)',
          data: growth.map(item => item.weight),
          tension: 0,
          yAxisID: 'weight',
          borderColor: '#4CA6A8',
          pointBackgroundColor: '#4CA6A8',
          pointBorderColor: '#4CA6A8',
          borderWidth: 2,
          pointRadius: 4
        },
        {
          label: 'Height (cm)',
          data: growth.map(item => item.height),
          tension: 0,
          yAxisID: 'height',
          borderColor: '#F4B183',
          pointBackgroundColor: '#F4B183',
          pointBorderColor: '#F4B183',
          borderWidth: 2,
          pointRadius: 4
        }
      ]
    };
  }
}
