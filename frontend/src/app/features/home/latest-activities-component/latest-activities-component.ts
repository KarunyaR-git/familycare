import { Component, Input } from '@angular/core';
import { LatestBabyActivitiesDetails } from '../../../core/models/home-dasboard-response';

@Component({
  selector: 'app-latest-activities-component',
  imports: [],
  templateUrl: './latest-activities-component.html',
  styleUrl: './latest-activities-component.css',
})
export class LatestActivitiesComponent {
  @Input() activities: LatestBabyActivitiesDetails[] = [];
}
