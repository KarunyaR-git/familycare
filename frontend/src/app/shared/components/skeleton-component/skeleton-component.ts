import { Component, Input } from '@angular/core';

export type SkeletonVariant = 'card' | 'list' | 'form';

@Component({
  selector: 'app-skeleton-component',
  imports: [],
  templateUrl: './skeleton-component.html',
  styleUrl: './skeleton-component.css',
})
export class SkeletonComponent {
  @Input() variant: SkeletonVariant = 'card';
  @Input() count = 3

  get items(): number[] {
    return Array.from({ length: this.count });
  }
}
