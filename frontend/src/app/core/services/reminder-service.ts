import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CreateOrUpdateReminderResponse, ReminderData, ReminderRequest, ReminderResponse, UpdateReminderRequest } from '../models/reminder-response.model';
import { forkJoin, Observable } from 'rxjs';
import { NotificationService } from './notification-service';

@Injectable({
  providedIn: 'root',
})
export class ReminderService {
  private apiUrl = environment.apiUrl;
  private reminderTimer: ReturnType<typeof setTimeout> | null = null;

  pendingCount = signal(0);

  constructor(private http: HttpClient, private notificationService: NotificationService){}

  getAllReminders(status:string, page:number, sortBy:string, order: string): Observable<ReminderResponse> {
    return this.http.get<ReminderResponse>(`${this.apiUrl}/reminders?status=${status}&page=${page}&limit=10&sortBy=${sortBy}&order=${order}`);
  }

  getPendingReminders(): Observable<ReminderData[]> {
    return this.http.get<ReminderData[]>(`${this.apiUrl}/reminders/scheduled`);
  }

  createReminder(body:ReminderRequest): Observable<CreateOrUpdateReminderResponse> {
    return this.http.post<CreateOrUpdateReminderResponse>(`${this.apiUrl}/reminders`, body);
  }

  updateReminder(id: string, body:UpdateReminderRequest): Observable<CreateOrUpdateReminderResponse> {
    return this.http.put<CreateOrUpdateReminderResponse>(`${this.apiUrl}/reminders/${id}`, body);
  }

  markAsNotified(id: string) {
    return this.http.patch(`${this.apiUrl}/reminders/${id}/notified`, {});
  }

  deleteReminder(id: string) {
    return this.http.delete(`${this.apiUrl}/reminders/${id}`);
  }

  private getNotificationTime(reminder: any): number {
    const reminderTime = new Date(reminder.reminderAt).getTime();
    const reminderBeforeMs = (reminder.reminderBefore || 0) * 60 * 1000;

    return reminderTime - reminderBeforeMs;
  }

  clearReminderTimer(): void {
    if (this.reminderTimer) {
      clearTimeout(this.reminderTimer);
      this.reminderTimer = null;
    }
  }

  startReminderScheduler(): void {
    this.clearReminderTimer();

    this.getPendingReminders().subscribe({
      next: (response: any) => {
        const reminders = response?.data || response || [];
        const now = Date.now();

        const missedReminders = reminders.filter((reminder: any) => {
          return this.getNotificationTime(reminder) <= now;
        });

        if (missedReminders.length > 0) {
          this.notifyAndMark(missedReminders);
          return;
        }

        const futureReminders = reminders.filter((reminder: any) => {
          return this.getNotificationTime(reminder) > now;
        });

        if (futureReminders.length === 0) {
          return;
        }

        const nearestReminder = futureReminders.reduce(
          (nearest: any, current: any) =>
            this.getNotificationTime(current) <
            this.getNotificationTime(nearest)
              ? current
              : nearest
        );

        const nearestTime =
          this.getNotificationTime(nearestReminder);

        const remindersAtSameTime = futureReminders.filter(
          (reminder: any) =>
            this.getNotificationTime(reminder) === nearestTime
        );

        const delay = nearestTime - now;

        this.reminderTimer = setTimeout(() => {
          this.notifyAndMark(remindersAtSameTime);       
        }, delay);
      },

      error: (error) => {
        console.error('Failed to schedule reminders', error);
      }
    });
  }

  private notifyAndMark(reminders: any[]): void {
    if (reminders.length === 0) {
      return;
    }

    this.showReminderNotification(reminders);

    const requests = reminders.map((reminder: any) =>
      this.markAsNotified(reminder._id)
    );

    forkJoin(requests).subscribe({
      next: () => {
        this.startReminderScheduler();
      },
      error: (error) => {
        console.error('Failed to mark reminder as notified', error);
      }
    });
  }

  private showReminderNotification(reminders: any[]): void {
    if (reminders.length === 1) {
      this.notificationService.info(
        `Reminder: ${reminders[0].title}`, 8000
      );
      return;
    }

    const firstTwoTitles = reminders
      .slice(0, 2)
      .map((reminder: any) => reminder.title)
      .join(', ');

    const remainingCount = reminders.length - 2;

    const message = remainingCount > 0
      ? `${reminders.length} upcoming reminders: ${firstTwoTitles} +${remainingCount} more`
      : `Upcoming reminders: ${firstTwoTitles}`;

    this.notificationService.info(message, 8000);
  }

  rescheduleReminders(): void {
    this.startReminderScheduler();
  }
}
