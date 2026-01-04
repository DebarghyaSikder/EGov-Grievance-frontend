import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { HeaderComponent } from '../../../shared/components/header/header';
import { ReportService } from '../../../core/services/report.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    HeaderComponent
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.scss'
})
export class ReportsComponent implements OnInit {
  isLoading = true;

  grievancesByStatus: any = null;
  grievancesByDepartment: any = null;
  grievancesByCategory: any = null;
  pendingVsResolved: any = null;
  averageResolutionTime: any = null;
  departmentPerformance: any = null;
  monthlyTrends: any = null;
  officerWorkload: any = null;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadAllReports();
  }

  loadAllReports(): void {
    this.isLoading = true;

    // Load all reports
    this.reportService.getGrievancesByStatus().subscribe({
      next: (response) => {
        if (response.success) {
          this.grievancesByStatus = response.data;
        }
      }
    });

    this.reportService.getGrievancesByDepartment().subscribe({
      next: (response) => {
        if (response.success) {
          this.grievancesByDepartment = response.data;
        }
      }
    });

    this.reportService.getGrievancesByCategory().subscribe({
      next: (response) => {
        if (response.success) {
          this.grievancesByCategory = response.data;
        }
      }
    });

    this.reportService.getPendingVsResolved().subscribe({
      next: (response) => {
        if (response.success) {
          this.pendingVsResolved = response.data;
        }
      }
    });

    this.reportService.getAverageResolutionTime().subscribe({
      next: (response) => {
        if (response.success) {
          this.averageResolutionTime = response.data;
        }
      }
    });

    this.reportService.getDepartmentPerformance().subscribe({
      next: (response) => {
        if (response.success) {
          this.departmentPerformance = response.data;
        }
      }
    });

    this.reportService.getMonthlyTrends().subscribe({
      next: (response) => {
        if (response.success) {
          this.monthlyTrends = response.data;
        }
      }
    });

    this.reportService.getOfficerWorkload().subscribe({
      next: (response) => {
        if (response.success) {
          this.officerWorkload = response.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'PENDING': '#ff9800',
      'ASSIGNED': '#2196f3',
      'IN_PROGRESS': '#4caf50',
      'ESCALATED': '#f44336',
      'RESOLVED': '#8bc34a',
      'CLOSED': '#9e9e9e'
    };
    return colors[status] || '#666';
  }
}
