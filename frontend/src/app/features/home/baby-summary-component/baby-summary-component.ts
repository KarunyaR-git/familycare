import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HomeDashboardBabyDetails } from '../../../core/models/home-dasboard-response.model';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-baby-summary-component',
  imports: [DatePipe, MatIconModule],
  templateUrl: './baby-summary-component.html',
  styleUrl: './baby-summary-component.css',
})
export class BabySummaryComponent {
  @Input() details: HomeDashboardBabyDetails | null = null;
  @Output() viewReports = new EventEmitter<void>();

  constructor(private router: Router) {}

  onViewReports() {
    this.viewReports.emit();
  }
}
