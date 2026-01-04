import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HeaderComponent } from '../../../shared/components/header/header';
import { ReportService } from '../../../core/services/report.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    HeaderComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class AdminDashboardComponent implements OnInit {
  dashboardSummary: any = null;
  departmentPerformance: any = null;
  isLoading = true;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    this.reportService.getDashboardSummary().subscribe({
      next: (response) => {
        if (response.success) {
          this.dashboardSummary = response.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });

    this.reportService.getDepartmentPerformance().subscribe({
      next: (response) => {
        if (response.success) {
          this.departmentPerformance = response.data;
        }
      }
    });
  }

  getDepartmentKeys(): string[] {
    return this.departmentPerformance ? Object.keys(this.departmentPerformance) : [];
  }
}
