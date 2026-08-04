import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button-component',
  imports: [],
  templateUrl: './button-component.html',
  styleUrl: './button-component.css',
})
export class ButtonComponent {
  @Input() text = '';
  @Input() type = 'button';
  @Input() disabled = false;
  @Input() loading = false;

  @Output() clicked = new EventEmitter();

  onClick(event: MouseEvent) {
    this.clicked.emit(event);
  }
}
