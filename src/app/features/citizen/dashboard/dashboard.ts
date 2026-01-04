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
import { NotificationService } from '../../../core/services/notification.service';
import { Grievance, GrievanceStatus } from '../../../core/models/grievance.model';
import { Notification } from '../../../core/models/notification.model';

@Component({
  selector: 'app-dashboard',
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
export class DashboardComponent implements OnInit {
  grievances: Grievance[] = [];
  notifications: Notification[] = [];
  isLoading = true;

  totalGrievances = 0;
  pendingGrievances = 0;
  resolvedGrievances = 0;
  escalatedGrievances = 0;

  displayedColumns: string[] = ['grievanceNumber', 'title', 'department', 'status', 'createdAt', 'actions'];

  constructor(
    private grievanceService: GrievanceService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    this.grievanceService.getMyGrievances().subscribe({
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

    this.notificationService.getMyNotifications().subscribe({
      next: (response) => {
        if (response.success) {
          this.notifications = response.data.slice(0, 5);
        }
      }
    });
  }

  calculateStatistics(): void {
    this.totalGrievances = this.grievances.length;
    this.pendingGrievances = this.grievances.filter(g =>
      g.status === GrievanceStatus.PENDING ||
      g.status === GrievanceStatus.ASSIGNED ||
      g.status === GrievanceStatus.IN_PROGRESS
    ).length;
    this.resolvedGrievances = this.grievances.filter(g =>
      g.status === GrievanceStatus.RESOLVED ||
      g.status === GrievanceStatus.CLOSED
    ).length;
    this.escalatedGrievances = this.grievances.filter(g =>
      g.status === GrievanceStatus.ESCALATED
    ).length;
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase().replace('_', '-')}`;
  }
}
