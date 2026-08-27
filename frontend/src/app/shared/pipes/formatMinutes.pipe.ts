import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatMinutes',
  standalone: true
})
export class FormatMinutesPipe implements PipeTransform {
  transform(value: number): string {
    if (!value || value <= 0) return '0 min';

    const hours = Math.floor(value / 60);
    const mins = value % 60;

    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hr`;
    
    return `${hours} hr ${mins} min`;
  }
}
