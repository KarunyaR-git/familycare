import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LatestBabyActivitiesDetails } from '../../../core/models/home-dasboard-response.model';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-latest-activities-component',
  imports: [DatePipe, MatIconModule],
  templateUrl: './latest-activities-component.html',
  styleUrl: './latest-activities-component.css',
})
export class LatestActivitiesComponent {
  @Input() activities: LatestBabyActivitiesDetails[] = [];
  
  @Output() viewTodayActivities = new EventEmitter<void>();
  activityLabel: any = {
    feeding: 'Feeding',
    sleep: 'Sleep',
    wakeUp: 'Wake Up',
    diaper: 'Diaper',
    growth: 'Growth',
    vaccination: 'Vaccination'
  }
  activityIcon: any = {
    feeding: 'restaurant',
    sleep: 'bedtime',
    wakeUp: 'wb_sunny',
    diaper: 'baby_changing_station',
    growth: 'monitoring',
    vaccination: 'vaccines'
  }

  onViewTodayActivities(): void {
    this.viewTodayActivities.emit();
  }
}
