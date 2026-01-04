import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/grievance.model';
import { CreateFeedbackRequest, Feedback } from '../models/feedback.model';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private apiUrl = `${environment.apiUrl}/feedbacks`;

  constructor(private http: HttpClient) {}

  submitFeedback(request: CreateFeedbackRequest): Observable<ApiResponse<Feedback>> {
    return this.http.post<ApiResponse<Feedback>>(this.apiUrl, request);
  }

  getMyFeedbacks(): Observable<ApiResponse<Feedback[]>> {
    return this.http.get<ApiResponse<Feedback[]>>(`${this.apiUrl}/my`);
  }

  getFeedbackByGrievance(grievanceId: number): Observable<ApiResponse<Feedback>> {
    return this.http.get<ApiResponse<Feedback>>(`${this.apiUrl}/grievance/${grievanceId}`);
  }

  getAverageRating(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/average-rating`);
  }
}
