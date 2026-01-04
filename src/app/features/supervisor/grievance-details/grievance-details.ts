import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from '../../../shared/components/header/header';
import { GrievanceService } from '../../../core/services/grievance.service';
import { Grievance } from '../../../core/models/grievance.model';

@Component({
  selector: 'app-supervisor-grievance-details',
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
    MatTabsModule,
    HeaderComponent
  ],
  templateUrl: './grievance-details.html',
  styleUrl: './grievance-details.scss'
})
export class SupervisorGrievanceDetailsComponent implements OnInit {
  grievance: Grievance | null = null;
  isLoading = true;
  isEscalating = false;
  isReassigning = false;
  isUpdatingStatus = false;

  escalateForm: FormGroup;
  reassignForm: FormGroup;
  statusForm: FormGroup;

  availableStatuses = [
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'CLOSED', label: 'Closed' }
  ];

  constructor(
    private route: ActivatedRoute,
    private grievanceService: GrievanceService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.escalateForm = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.reassignForm = this.fb.group({
      officerId: ['', Validators.required]
    });

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
        }
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load grievance details', 'Error');
        this.isLoading = false;
      }
    });
  }

  canEscalate(): boolean {
    return this.grievance?.status === 'ASSIGNED' ||
           this.grievance?.status === 'IN_PROGRESS';
  }

  canReassign(): boolean {
    return this.grievance?.status !== 'RESOLVED' &&
           this.grievance?.status !== 'CLOSED';
  }

  canUpdateStatus(): boolean {
    return this.grievance?.status !== 'CLOSED';
  }

  escalate(): void {
    if (this.escalateForm.invalid || !this.grievance) {
      this.escalateForm.markAllAsTouched();
      return;
    }

    this.isEscalating = true;

    this.grievanceService.escalateGrievance(this.grievance.id, this.escalateForm.value.reason).subscribe({
      next: (response) => {
        this.isEscalating = false;
        if (response.success) {
          this.toastr.success('Grievance escalated successfully!', 'Success');
          this.grievance = response.data;
          this.escalateForm.reset();
        } else {
          this.toastr.error(response.message, 'Error');
        }
      },
      error: (error) => {
        this.isEscalating = false;
        this.toastr.error(error.error?.message || 'Failed to escalate', 'Error');
      }
    });
  }

  reassign(): void {
    if (this.reassignForm.invalid || !this.grievance) {
      this.reassignForm.markAllAsTouched();
      return;
    }

    this.isReassigning = true;

    this.grievanceService.reassignGrievance(this.grievance.id, this.reassignForm.value.officerId).subscribe({
      next: (response) => {
        this.isReassigning = false;
        if (response.success) {
          this.toastr.success('Grievance reassigned successfully!', 'Success');
          this.grievance = response.data;
          this.reassignForm.reset();
        } else {
          this.toastr.error(response.message, 'Error');
        }
      },
      error: (error) => {
        this.isReassigning = false;
        this.toastr.error(error.error?.message || 'Failed to reassign', 'Error');
      }
    });
  }

  updateStatus(): void {
    if (this.statusForm.invalid || !this.grievance) {
      this.statusForm.markAllAsTouched();
      return;
    }

    this.isUpdatingStatus = true;

    const request = {
      status: this.statusForm.value.status,
      remarks: this.statusForm.value.remarks
    };

    this.grievanceService.updateStatus(this.grievance.id, request).subscribe({
      next: (response) => {
        this.isUpdatingStatus = false;
        if (response.success) {
          this.toastr.success('Status updated successfully!', 'Success');
          this.grievance = response.data;
          this.statusForm.reset();
        } else {
          this.toastr.error(response.message, 'Error');
        }
      },
      error: (error) => {
        this.isUpdatingStatus = false;
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
