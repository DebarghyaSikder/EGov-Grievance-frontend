import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getMyNotifications(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my`);
  }

  getUnreadNotifications(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/unread`);
  }

  getUnreadCount(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/unread-count`);
  }

  markAsRead(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/read`, {});
  }

  markAllAsRead(): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/mark-all-read`, {});
  }
}
