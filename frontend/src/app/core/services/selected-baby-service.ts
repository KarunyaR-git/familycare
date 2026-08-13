import { Injectable, signal } from '@angular/core';
import { BabySummary } from '../models/baby-summary.model';

@Injectable({
  providedIn: 'root',
})
export class SelectedBabyService {
  private selectedBaby = signal<BabySummary | null>(null);
  selectedBabyValue = this.selectedBaby.asReadonly();

  setSelectedBaby(baby: BabySummary) {
    this.selectedBaby.set(baby);
  }
  
  clearSelectedBaby(): void {
    this.selectedBaby.set(null);
  }
}
