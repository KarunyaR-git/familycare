import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login-component/login-component';
import { HomeComponent } from './features/home/home-component/home-component';
import { authGuard } from './auth-guard';
import { RegisterComponent } from './features/auth/register/register-component';

export const routes: Routes = [
    {path:'', redirectTo:'login', pathMatch:'full'},
    {path:'login', component: LoginComponent},
    {
        path:'register', 
        component: RegisterComponent
    },
    {
        path:'home', 
        component: HomeComponent,
        canActivate: [authGuard]
    }
    
];
