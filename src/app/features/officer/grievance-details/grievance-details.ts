import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from '../../../shared/components/header/header';
import { GrievanceService } from '../../../core/services/grievance.service';
import { Grievance } from '../../../core/models/grievance.model';

@Component({
  selector: 'app-officer-grievance-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    HeaderComponent
  ],
  templateUrl: './grievance-details.html',
  styleUrl: './grievance-details.scss'
})
export class OfficerGrievanceDetailsComponent implements OnInit {
  grievance: Grievance | null = null;
  isLoading = true;
  isUpdating = false;

  statusForm: FormGroup;

  availableStatuses = [
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'RESOLVED', label: 'Resolved' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private grievanceService: GrievanceService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.statusForm = this.fb.group({
      status: ['', Validators.required],
      remarks: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadGrievance(+id);
    }
  }

  loadGrievance(id: number): void {
    this.isLoading = true;

    this.grievanceService.getGrievanceById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.grievance = response.data;
          this.updateAvailableStatuses();
        }
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load grievance details', 'Error');
        this.isLoading = false;
      }
    });
  }

  updateAvailableStatuses(): void {
    if (!this.grievance) return;

    switch (this.grievance.status) {
      case 'ASSIGNED':
        this.availableStatuses = [
          { value: 'IN_PROGRESS', label: 'In Progress' }
        ];
        break;
      case 'IN_PROGRESS':
        this.availableStatuses = [
          { value: 'RESOLVED', label: 'Resolved' }
        ];
        break;
      case 'ESCALATED':
        this.availableStatuses = [
          { value: 'IN_PROGRESS', label: 'In Progress' },
          { value: 'RESOLVED', label: 'Resolved' }
        ];
        break;
      default:
        this.availableStatuses = [];
    }
  }

  canUpdateStatus(): boolean {
    return this.grievance?.status === 'ASSIGNED' ||
           this.grievance?.status === 'IN_PROGRESS' ||
           this.grievance?.status === 'ESCALATED';
  }

  updateStatus(): void {
    if (this.statusForm.invalid || !this.grievance) {
      this.statusForm.markAllAsTouched();
      return;
    }

    this.isUpdating = true;

    const request = {
      status: this.statusForm.value.status,
      remarks: this.statusForm.value.remarks
    };

    this.grievanceService.updateStatus(this.grievance.id, request).subscribe({
      next: (response) => {
        this.isUpdating = false;
        if (response.success) {
          this.toastr.success('Status updated successfully!', 'Success');
          this.grievance = response.data;
          this.statusForm.reset();
          this.updateAvailableStatuses();
        } else {
          this.toastr.error(response.message, 'Error');
        }
      },
      error: (error) => {
        this.isUpdating = false;
        this.toastr.error(error.error?.message || 'Failed to update status', 'Error');
      }
    });
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase().replace('_', '-')}`;
  }

  isOverdue(): boolean {
    if (!this.grievance?.slaDeadline) return false;
    return new Date(this.grievance.slaDeadline) < new Date() &&
           this.grievance.status !== 'RESOLVED' &&
           this.grievance.status !== 'CLOSED';
  }
}
