import { Component, OnInit, signal } from '@angular/core';
import { HomeService } from '../../../core/services/home-service';
import { NotificationService } from '../../../core/services/notification-service';
import { getErrorMessage } from '../../../shared/utils/error-handler';
import { HomeDashboard, HomeDashboardBabyDetails } from '../../../core/models/home-dasboard-response.model';
import { SelectedBabyService } from '../../../core/services/selected-baby-service';
import { HeaderComponent } from '../header-component/header-component';
import { BabyDashboardComponent } from '../baby-dashboard-component/baby-dashboard-component';
import { BabySummary } from '../../../core/models/baby-summary.model';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FamilyReminderComponent } from '../family-reminder-component/family-reminder-component';
import { ReminderService } from '../../../core/services/reminder-service';
import { MatDialog } from '@angular/material/dialog';
import { BabyFormComponent } from '../../babies/baby-form-component/baby-form-component';
import { BabyResponse } from '../../../core/models/baby.model';

@Component({
  selector: 'home-component',
  imports: [HeaderComponent, BabyDashboardComponent, FamilyReminderComponent],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent implements OnInit {
  dashboardDetails: HomeDashboard | null = null;
  babyDetails: HomeDashboardBabyDetails | null = null;
  babies: BabySummary[]= [];
  loading = signal(false);
  constructor(private homeService: HomeService, private notificationService: NotificationService, private selectedBabyService: SelectedBabyService, private authService: AuthService, private route: Router, public reminderService: ReminderService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loading.set(true);
    this.homeService.getHomeDashboardDetails().subscribe({
      next: (response:HomeDashboard)=> {
        this.dashboardDetails = response;
        const { babies, remindersCount, ...babyDetails } = response;
        this.babies = babies;
        this.reminderService.pendingCount.set(remindersCount);;

        if (babies.length > 0) {
          this.babyDetails = babyDetails;
          this.selectedBabyService.setSelectedBaby(babies[0]);
        } else {
          this.babyDetails = null;
        }
        this.loading.set(false);
      },
      error: (error)=> {
        this.loading.set(false);
        this.notificationService.error(getErrorMessage(error));
      }
    })
  }

  onBabyChange(babyId: string) {
    const selectedBaby = this.babies.find((baby:BabySummary)=>{return baby.id === babyId});
    if(selectedBaby) {
      this.selectedBabyService.setSelectedBaby(selectedBaby);
    }    
    if (!selectedBaby) {
      return;
    }

    this.loading.set(true);

    this.homeService.getHomeDashboardBabyDetails(babyId).subscribe({
      next: (response) => {
        this.babyDetails = response;
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.notificationService.error(getErrorMessage(error));
      }
    });
  }

  onrefreshdashboard() {
    this.loading.set(true);
    const baby = this.selectedBabyService.selectedBabyValue();
    this.homeService.getHomeDashboardBabyDetails(baby?.id || '').subscribe({
      next: (response) => {
        this.babyDetails = response;
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.notificationService.error(getErrorMessage(error));
      }
    });
  }

  onAddBaby() {
    const dialogRef = this.dialog.open(BabyFormComponent, {
      disableClose: true,
      data: {
        mode: "create"
      }
    });

    dialogRef.afterClosed().subscribe((response) => {      
      if(response?.mode === "created") {
        this.loading.set(true);
        const baby = {
          id: response.newBaby._id,
          name: response.newBaby.name
        }
        this.babies = [...this.babies, baby];
        this.loading.set(false);
      }
    });
  }

  logoutUser() {
    this.authService.logout();
  }
}
