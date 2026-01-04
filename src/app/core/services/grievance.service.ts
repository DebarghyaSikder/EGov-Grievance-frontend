import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  CreateGrievanceRequest,
  Grievance,
  PageResponse,
  UpdateStatusRequest
} from '../models/grievance.model';

@Injectable({
  providedIn: 'root'
})
export class GrievanceService {

  private apiUrl = `${environment.apiUrl}/grievances`;

  constructor(private http: HttpClient) {}

  // Create grievance
  createGrievance(request: CreateGrievanceRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl, request);
  }

  // Get grievance by ID
  getGrievanceById(id: number): Observable<ApiResponse<Grievance>> {
    return this.http.get<ApiResponse<Grievance>>(`${this.apiUrl}/${id}`);
  }

  // Track grievance by number
  trackGrievance(grievanceNumber: string): Observable<ApiResponse<Grievance>> {
    return this.http.get<ApiResponse<Grievance>>(`${this.apiUrl}/tracking/${grievanceNumber}`);
  }

  // Get my grievances (citizen)
  getMyGrievances(): Observable<ApiResponse<Grievance[]>> {
    return this.http.get<ApiResponse<Grievance[]>>(`${this.apiUrl}/my`);
  }

  // Get my grievances - paginated
  getMyGrievancesPaged(page: number = 0, size: number = 10, sortBy: string = 'createdAt', sortDir: string = 'desc'): Observable<ApiResponse<PageResponse<Grievance>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<ApiResponse<PageResponse<Grievance>>>(`${this.apiUrl}/my/paged`, { params });
  }

  // Get assigned grievances (officer)
  getAssignedGrievances(): Observable<ApiResponse<Grievance[]>> {
    return this.http.get<ApiResponse<Grievance[]>>(`${this.apiUrl}/officer/assigned`);
  }

  // Get assigned grievances - paginated
  getAssignedGrievancesPaged(page: number = 0, size: number = 10, sortBy: string = 'createdAt', sortDir: string = 'desc'): Observable<ApiResponse<PageResponse<Grievance>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<ApiResponse<PageResponse<Grievance>>>(`${this.apiUrl}/officer/assigned/paged`, { params });
  }

  // Get all grievances (supervisor/admin)
  getAllGrievances(): Observable<ApiResponse<Grievance[]>> {
    return this.http.get<ApiResponse<Grievance[]>>(`${this.apiUrl}/all`);
  }

  // Get all grievances - paginated
  getAllGrievancesPaged(page: number = 0, size: number = 10, sortBy: string = 'createdAt', sortDir: string = 'desc'): Observable<ApiResponse<PageResponse<Grievance>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<ApiResponse<PageResponse<Grievance>>>(`${this.apiUrl}/all/paged`, { params });
  }

  // Get grievances by status
  getGrievancesByStatus(status: string): Observable<ApiResponse<Grievance[]>> {
    return this.http.get<ApiResponse<Grievance[]>>(`${this.apiUrl}/status/${status}`);
  }

  // Update status
  updateStatus(id: number, request: UpdateStatusRequest): Observable<ApiResponse<Grievance>> {
    return this.http.put<ApiResponse<Grievance>>(`${this.apiUrl}/${id}/status`, request);
  }

  // Escalate grievance
  escalateGrievance(id: number, reason: string): Observable<ApiResponse<Grievance>> {
    return this.http.put<ApiResponse<Grievance>>(`${this.apiUrl}/${id}/escalate`, { reason });
  }

  // Reassign grievance
  reassignGrievance(id: number, officerId: number): Observable<ApiResponse<Grievance>> {
    return this.http.put<ApiResponse<Grievance>>(`${this.apiUrl}/${id}/reassign`, { officerId });
  }
}
