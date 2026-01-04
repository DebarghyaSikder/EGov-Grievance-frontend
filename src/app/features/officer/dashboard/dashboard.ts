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
import { Grievance, GrievanceStatus } from '../../../core/models/grievance.model';

@Component({
  selector: 'app-officer-dashboard',
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
export class OfficerDashboardComponent implements OnInit {
  grievances: Grievance[] = [];
  isLoading = true;

  totalAssigned = 0;
  inProgressCount = 0;
  resolvedCount = 0;
  escalatedCount = 0;

  displayedColumns: string[] = ['grievanceNumber', 'title', 'citizen', 'status', 'slaDeadline', 'actions'];

  constructor(
    private grievanceService: GrievanceService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    this.grievanceService.getAssignedGrievances().subscribe({
      next: (response) => {
        if (response.success) {
          this.grievances = response.data;
          this.calculateStatistics();
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  calculateStatistics(): void {
    this.totalAssigned = this.grievances.length;
    this.inProgressCount = this.grievances.filter(g =>
      g.status === GrievanceStatus.ASSIGNED ||
      g.status === GrievanceStatus.IN_PROGRESS
    ).length;
    this.resolvedCount = this.grievances.filter(g =>
      g.status === GrievanceStatus.RESOLVED ||
      g.status === GrievanceStatus.CLOSED
    ).length;
    this.escalatedCount = this.grievances.filter(g =>
      g.status === GrievanceStatus.ESCALATED
    ).length;
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
