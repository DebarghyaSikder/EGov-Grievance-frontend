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
import { Grievance } from '../../../core/models/grievance.model';
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
  isLoadingNotifications = true;

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
    this.loadNotifications();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    this.grievanceService.getMyGrievances().subscribe({
      next: (response: any) => {
        console.log('My Grievances Response:', response);
        if (response && response.success && response.data) {
          this.grievances = response.data;
        } else if (response && response.data) {
          this.grievances = response.data;
        } else if (Array.isArray(response)) {
          this.grievances = response;
        }
        this.calculateStatistics();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading grievances:', error);
        this.isLoading = false;
      }
    });
  }

  loadNotifications(): void {
    this.isLoadingNotifications = true;

    this.notificationService.getMyNotifications().subscribe({
      next: (response: any) => {
        console.log('Notifications Response:', response);
        if (response && response.success && response.data) {
          this.notifications = response.data;
        } else if (response && response.data) {
          this.notifications = response.data;
        } else if (Array.isArray(response)) {
          this.notifications = response;
        }
        // Limit to 5 most recent
        this.notifications = this.notifications.slice(0, 5);
        console.log('Parsed notifications:', this.notifications);
        this.isLoadingNotifications = false;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.isLoadingNotifications = false;
      }
    });
  }

  calculateStatistics(): void {
    this.totalGrievances = this.grievances.length;
    this.pendingGrievances = this.grievances.filter(g =>
      g.status === 'PENDING' ||
      g.status === 'ASSIGNED' ||
      g.status === 'IN_PROGRESS'
    ).length;
    this.resolvedGrievances = this.grievances.filter(g =>
      g.status === 'RESOLVED' ||
      g.status === 'CLOSED'
    ).length;
    this.escalatedGrievances = this.grievances.filter(g =>
      g.status === 'ESCALATED'
    ).length;
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase().replace('_', '-')}`;
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'GRIEVANCE_CREATED': return 'add_circle';
      case 'STATUS_UPDATED': return 'update';
      case 'GRIEVANCE_ASSIGNED': return 'person_add';
      case 'GRIEVANCE_RESOLVED': return 'check_circle';
      case 'GRIEVANCE_ESCALATED': return 'warning';
      default: return 'notifications';
    }
  }
}
