import { Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-quick-actions-component',
  imports: [MatChipsModule, MatIconModule],
  templateUrl: './quick-actions-component.html',
  styleUrl: './quick-actions-component.css',
})
export class QuickActionsComponent {
  quickActions = [
  { label: 'Sleep', icon: 'bedtime', key: 'sleep' },
  { label: 'Wake Up', icon: 'wb_sunny', key: 'wakeup' },
  { label: 'Feeding', icon: 'restaurant', key: 'feeding' },
  { label: 'Diaper', icon: 'baby_changing_station', key: 'diaper' },
  { label: 'Vaccination', icon: 'vaccines', key: 'vaccination' },
  { label: 'Growth', icon: 'monitoring', key: 'growth' }
];
}
