import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { HeaderComponent } from '../../../shared/components/header/header';
import { GrievanceService } from '../../../core/services/grievance.service';
import { Grievance } from '../../../core/models/grievance.model';

@Component({
  selector: 'app-my-grievances',
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
    MatFormFieldModule,
    MatSelectModule,
    HeaderComponent
  ],
  templateUrl: './my-grievances.html',
  styleUrl: './my-grievances.scss'
})
export class MyGrievancesComponent implements OnInit {
  grievances: Grievance[] = [];
  isLoading = true;

  // Pagination
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 50];

  // Sorting
  sortBy = 'createdAt';
  sortDir = 'desc';

  displayedColumns: string[] = ['grievanceNumber', 'title', 'department', 'category', 'status', 'createdAt', 'actions'];

  constructor(private grievanceService: GrievanceService) {}

  ngOnInit(): void {
    this.loadGrievances();
  }

  loadGrievances(): void {
    this.isLoading = true;

    this.grievanceService.getMyGrievancesPaged(this.pageIndex, this.pageSize, this.sortBy, this.sortDir).subscribe({
      next: (response) => {
        if (response.success) {
          this.grievances = response.data.content;
          this.totalElements = response.data.totalElements;
        }
        this.isLoading = false;
      },
      error: () => {
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
}
