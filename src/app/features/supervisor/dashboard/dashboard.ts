import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HeaderComponent } from '../../../shared/components/header/header';
import { GrievanceService } from '../../../core/services/grievance.service';
import { ReportService } from '../../../core/services/report.service';
import { Grievance } from '../../../core/models/grievance.model';

@Component({
  selector: 'app-supervisor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    HeaderComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class SupervisorDashboardComponent implements OnInit {
  grievances: Grievance[] = [];
  dashboardSummary: any = null;
  isLoading = true;

  displayedColumns: string[] = ['grievanceNumber', 'title', 'department', 'status', 'slaDeadline', 'actions'];

  constructor(
    private grievanceService: GrievanceService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    this.reportService.getDashboardSummary().subscribe({
      next: (response: any) => {
        // Response format: { success: true, data: { ... } }
        if (response && response.success && response.data) {
          this.dashboardSummary = response.data;
        } else if (response && !response.success) {
          this.dashboardSummary = response;
        }
      },
      error: (error) => {
        console.error('Error loading dashboard summary:', error);
      }
    });

    this.grievanceService.getAllGrievances().subscribe({
      next: (response: any) => {
        // Response format: { success: true, data: [...] }
        if (response && response.success && response.data) {
          this.grievances = Array.isArray(response.data) ? response.data : [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading grievances:', error);
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase().replace('_', '-')}`;
  }

  isOverdue(grievance: Grievance): boolean {
    if (!grievance.slaDeadline) return false;
    return new Date(grievance.slaDeadline) < new Date() &&
           grievance.status !== 'RESOLVED' &&
           grievance.status !== 'CLOSED';
  }
}
