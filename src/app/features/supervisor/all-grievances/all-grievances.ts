import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HeaderComponent } from '../../../shared/components/header/header';
import { GrievanceService } from '../../../core/services/grievance.service';
import { Grievance } from '../../../core/models/grievance.model';

@Component({
  selector: 'app-all-grievances',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    HeaderComponent
  ],
  templateUrl: './all-grievances.html',
  styleUrl: './all-grievances.scss'
})
export class AllGrievancesComponent implements OnInit {
  grievances: Grievance[] = [];
  isLoading = true;

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 50];

  sortBy = 'createdAt';
  sortDir = 'desc';

  displayedColumns: string[] = ['grievanceNumber', 'title', 'department', 'category', 'status', 'slaDeadline', 'actions'];

  constructor(private grievanceService: GrievanceService) {}

  ngOnInit(): void {
    this.loadGrievances();
  }

  loadGrievances(): void {
  this.isLoading = true;

  console.log('Loading grievances...');

  this.grievanceService.getAllGrievancesPaged(this.pageIndex, this.pageSize, this.sortBy, this.sortDir).subscribe({
    next: (response: any) => {
      console.log('Raw response:', response);
      console.log('response.success:', response?.success);
      console.log('response.data:', response?.data);
      console.log('response.data.content:', response?.data?.content);

      if (response && response.success && response.data) {
        this.grievances = response.data.content || [];
        this.totalElements = response.data.totalElements || 0;
        console.log('Parsed grievances:', this.grievances);
        console.log('Total elements:', this.totalElements);
      }
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error loading grievances:', error);
      this.isLoading = false;
    }
  });
}

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadGrievances();
  }

  onSortChange(sortBy: string): void {
    if (this.sortBy === sortBy) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortBy;
      this.sortDir = 'desc';
    }
    this.pageIndex = 0;
    this.loadGrievances();
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
