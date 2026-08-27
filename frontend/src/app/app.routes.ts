import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login-component/login-component';
import { HomeComponent } from './features/home/home-component/home-component';
import { authGuard } from './auth-guard';
import { RegisterComponent } from './features/auth/register/register-component';
import { TodayActivitiesComponent } from './features/home/today-activities-component/today-activities-component';
import { RemindersComponent } from './features/home/reminders-component/reminders-component';
import { BabyReportComponent } from './features/reports/baby-report-component/baby-report-component';

export const routes: Routes = [
    {path:'', redirectTo:'login', pathMatch:'full'},
    {path:'login', component: LoginComponent},
    {
        path:'register', 
        component: RegisterComponent
    },
    {
        path:'home', 
        canActivateChild: [authGuard],
        children: [            
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'activities/:babyId',
                component: TodayActivitiesComponent
            },
            {
                path: 'reminders',
                component: RemindersComponent
            },
            {
                path: ':babyId/reports',
                component: BabyReportComponent
            }
        ]
    }    
];
