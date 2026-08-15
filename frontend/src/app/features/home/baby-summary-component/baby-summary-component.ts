import { Component, Input } from '@angular/core';
import { HomeDashboardBabyDetails } from '../../../core/models/home-dasboard-response.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-baby-summary-component',
  imports: [DatePipe],
  templateUrl: './baby-summary-component.html',
  styleUrl: './baby-summary-component.css',
})
export class BabySummaryComponent {
  @Input() details: HomeDashboardBabyDetails | null = null;
}
