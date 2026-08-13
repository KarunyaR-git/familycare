import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button-component/button-component';

@Component({
  selector: 'app-header-component',
  imports: [ButtonComponent],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent implements OnInit{
  @Output() addBaby = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  greeting = '';

  ngOnInit() {
    this.setGreeting();
  }

  onAddBaby(): void {
    this.addBaby.emit();
  }

  onLogout(): void {
    this.logout.emit();
  }

  private setGreeting(): void {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      this.greeting = 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      this.greeting = 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      this.greeting = 'Good Evening';
    } else {
      this.greeting = 'Good Night';
    }
  }
}
