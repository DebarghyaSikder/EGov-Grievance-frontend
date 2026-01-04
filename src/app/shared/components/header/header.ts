import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  unreadCount = 0;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUnreadCount();
      }
    });
  }

  loadUnreadCount(): void {
    this.notificationService.getUnreadCount().subscribe({
      next: (response) => {
        if (response.success) {
          this.unreadCount = response.data;
        }
      }
    });
  }

  getDashboardLink(): string {
    if (!this.currentUser) return '/login';

    switch (this.currentUser.role) {
      case UserRole.CITIZEN:
        return '/citizen/dashboard';
      case UserRole.DEPARTMENT_OFFICER:
        return '/officer/dashboard';
      case UserRole.SUPERVISORY_OFFICER:
        return '/supervisor/dashboard';
      case UserRole.SYSTEM_ADMIN:
        return '/admin/dashboard';
      default:
        return '/login';
    }
  }

  getNotificationsLink(): string {
    if (!this.currentUser) return '/login';

    switch (this.currentUser.role) {
      case UserRole.CITIZEN:
        return '/citizen/dashboard';
      case UserRole.DEPARTMENT_OFFICER:
        return '/officer/dashboard';
      case UserRole.SUPERVISORY_OFFICER:
        return '/supervisor/dashboard';
      case UserRole.SYSTEM_ADMIN:
        return '/admin/dashboard';
      default:
        return '/login';
    }
  }

  getRoleDisplayName(): string {
    if (!this.currentUser) return '';

    switch (this.currentUser.role) {
      case UserRole.CITIZEN:
        return 'Citizen';
      case UserRole.DEPARTMENT_OFFICER:
        return 'Officer';
      case UserRole.SUPERVISORY_OFFICER:
        return 'Supervisor';
      case UserRole.SYSTEM_ADMIN:
        return 'Admin';
      default:
        return '';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
