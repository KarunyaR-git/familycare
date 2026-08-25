import { Component, OnInit, signal } from '@angular/core';
import { HomeService } from '../../../core/services/home-service';
import { NotificationService } from '../../../core/services/notification-service';
import { TodayActivities, TodayBabyActivities } from '../../../core/models/home-dasboard-response.model';
import { BabySummary } from '../../../core/models/baby-summary.model';
import { getErrorMessage } from '../../../shared/utils/error-handler';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownComponent, DropdownOption } from '../../../shared/components/dropdown-component/dropdown-component';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SkeletonComponent } from '../../../shared/components/skeleton-component/skeleton-component';
import { CapitalizePipe } from '../../../shared/pipes/capitalize.pipe';
import { DiaperFormComponent } from '../../diapers/diaper-form-component/diaper-form-component';
import { FeedingFormComponent } from '../../feedings/feeding-form-component/feeding-form-component';
import { GrowthFormComponent } from '../../growth/growth-form-component/growth-form-component';
import { SleepFormComponent } from '../../sleeps/sleep-form-component/sleep-form-component';
import { VaccinationFormComponent } from '../../vaccinations/vaccination-form-component/vaccination-form-component';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal-component/confirmation-modal-component';
import { Observable } from 'rxjs';
import { FeedingService } from '../../../core/services/feeding-service';
import { DiaperService } from '../../../core/services/diaper-service';
import { GrowthService } from '../../../core/services/growth-service';
import { VaccinationService } from '../../../core/services/vaccination-service';
import { SleepService } from '../../../core/services/sleep-service';

@Component({
  selector: 'app-today-activities-component',
  imports: [MatIconModule, DropdownComponent, FormsModule, DatePipe, SkeletonComponent, CapitalizePipe],
  templateUrl: './today-activities-component.html',
  styleUrl: './today-activities-component.css',
})
export class TodayActivitiesComponent implements OnInit {
  todayActivityList: TodayActivities[] = [];
  filteredList: TodayActivities[] = [];
  selectedBaby: BabySummary | null = null;
  actionTitle:Record<string, string> = {
    sleep: 'Sleep',
    wakeUp: 'Wake Up',
    feeding: 'Feeding',
    diaper: 'Diaper',
    vaccination: 'Vaccination',
    growth: 'Growth'
  };
  actionIcon:Record<string, string> = {
    sleep: 'bedtime',
    wakeUp: 'wb_sunny',
    feeding: 'restaurant',
    diaper: 'baby_changing_station',
    vaccination: 'vaccines',
    growth: 'monitoring'
  };
  selectedActionId = signal("all");
  actionList:DropdownOption[] = [
    { label: 'All', value: 'all' },
    { label: 'Sleep', value: 'sleep' },
    { label: 'Wake Up', value: 'wakeUp' },
    { label: 'Feeding', value: 'feeding' },
    { label: 'Diaper', value: 'diaper' },
    { label: 'Vaccination', value: 'vaccination' },
    { label: 'Growth', value: 'growth' }
  ];
  today = new Date();
  loading = signal(false);

  constructor(private route: ActivatedRoute, private homeService: HomeService, private notificationService: NotificationService, private router: Router, private dialog: MatDialog, private feedingService: FeedingService, private diaperService: DiaperService, private growthService: GrowthService, private vaccinationService: VaccinationService, private sleepService: SleepService) {}

  ngOnInit() {
    this.loadActivities();    
  }

  loadActivities() {
    this.loading.set(true);
    const babyId = this.route.snapshot.paramMap.get('babyId');
    if (!babyId) {
      this.loading.set(false);
      this.onBackToHome();
      return;
    }
    this.homeService.getTodayActivities(babyId).subscribe({
      next: (response: TodayBabyActivities) => {
        this.selectedBaby = response.baby
        this.todayActivityList = response.activities;
        this.applyFilter();
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.notificationService.error(getErrorMessage(error));
      }
    })
  }

  onBackToHome() {
    this.router.navigate(["/home"]);
  }

  onActionChange(actionId: string) {
    this.selectedActionId.set(actionId);
    this.applyFilter();
  }

  applyFilter() {
    if(this.selectedActionId() === 'all') {
      this.filteredList = this.todayActivityList;
    } else {
      this.filteredList = this.todayActivityList.filter((activity:TodayActivities) => activity.activityType === this.selectedActionId())
    }
  }

  onEditActivity(activity: TodayActivities) {
    let component: ComponentType<any>;
    const type = activity.activityType === 'wakeUp' ? 'sleep' : activity.activityType;
    let data: any = {
      mode: 'edit',
      [type]: activity,
      babyId: this.selectedBaby?.id
    };
    if (
      activity.activityType === 'sleep' ||
      activity.activityType === 'wakeUp'
    ) {
      data.action =
        activity.sleptAt && activity.wokeUpAt
          ? 'both'
          : activity.sleptAt
            ? 'sleep'
            : 'wakeup';
    }
    switch (activity.activityType) {
      case 'feeding':
        component = FeedingFormComponent;
        break;

      case 'diaper':
        component = DiaperFormComponent;
        break;

      case 'growth':
        component = GrowthFormComponent;
        break;

      case 'vaccination':
        component = VaccinationFormComponent;
        break;

      case 'sleep':
      case 'wakeUp':
        component = SleepFormComponent;
        break;

      default:
        return;
    }

    const dialogRef = this.dialog.open(component, {
      disableClose: true,
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.loadActivities();
      }
    });
  }

  onDeleteActivity(activity: TodayActivities) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      disableClose: true,
      data: {
        title: `Delete ${this.actionTitle[activity.activityType]}`,
        message: `Are you sure you want to delete this ${this.actionTitle[activity.activityType]} activity?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    let deleteRequest: Observable<void>;

    switch (activity.activityType) {
      case 'feeding':
        deleteRequest = this.feedingService.deleteFeeding(activity._id);
        break;

      case 'diaper':
        deleteRequest = this.diaperService.deleteDiaper(activity._id);
        break;

      case 'growth':
        deleteRequest = this.growthService.deleteGrowth(activity._id);
        break;

      case 'vaccination':
        deleteRequest = this.vaccinationService.deleteVaccination(activity._id);
        break;

      case 'sleep':
      case 'wakeUp':
        deleteRequest = this.sleepService.deleteSleep(activity._id);
        break;

      default:
        return;
    }

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        deleteRequest.subscribe({
          next: () => {            
            this.notificationService.success('Deleted Successfully!');
            this.loadActivities();
          },
          error: (error)=> {
            this.notificationService.error(getErrorMessage(error));
          }
        });
      }
    });    
  }

  formatMinutes(value: number): string {
    if (!value || value <= 0) return '0 min';

    const hours = Math.floor(value / 60);
    const mins = value % 60;

    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hr`;
    
    return `${hours} hr ${mins} min`;
  }
}
