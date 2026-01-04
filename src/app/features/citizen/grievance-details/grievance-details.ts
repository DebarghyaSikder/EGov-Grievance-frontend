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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from '../../../shared/components/header/header';
import { GrievanceService } from '../../../core/services/grievance.service';
import { FeedbackService } from '../../../core/services/feedback.service';
import { Grievance } from '../../../core/models/grievance.model';
import { Feedback } from '../../../core/models/feedback.model';

@Component({
  selector: 'app-grievance-details',
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
    MatDialogModule,
    HeaderComponent
  ],
  templateUrl: './grievance-details.html',
  styleUrl: './grievance-details.scss'
})
export class GrievanceDetailsComponent implements OnInit {
  grievance: Grievance | null = null;
  feedback: Feedback | null = null;
  isLoading = true;
  isSubmittingFeedback = false;
  showFeedbackForm = false;

  feedbackForm: FormGroup;
  ratings = [1, 2, 3, 4, 5];

  constructor(
    private route: ActivatedRoute,
    private grievanceService: GrievanceService,
    private feedbackService: FeedbackService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.feedbackForm = this.fb.group({
      rating: ['', Validators.required],
      comments: ['', [Validators.required, Validators.minLength(10)]],
      reopenRequested: [false]
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
          this.loadFeedback(id);
        }
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load grievance details', 'Error');
        this.isLoading = false;
      }
    });
  }

  loadFeedback(grievanceId: number): void {
    this.feedbackService.getFeedbackByGrievance(grievanceId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.feedback = response.data;
        }
      }
    });
  }

  canSubmitFeedback(): boolean {
    return this.grievance?.status === 'RESOLVED' || this.grievance?.status === 'CLOSED';
  }

  toggleFeedbackForm(): void {
    this.showFeedbackForm = !this.showFeedbackForm;
  }

  submitFeedback(): void {
    if (this.feedbackForm.invalid || !this.grievance) {
      this.feedbackForm.markAllAsTouched();
      return;
    }

    this.isSubmittingFeedback = true;

    const request = {
      grievanceId: this.grievance.id,
      rating: this.feedbackForm.value.rating,
      comments: this.feedbackForm.value.comments,
      reopenRequested: this.feedbackForm.value.reopenRequested
    };

    this.feedbackService.submitFeedback(request).subscribe({
      next: (response) => {
        this.isSubmittingFeedback = false;
        if (response.success) {
          this.toastr.success('Feedback submitted successfully!', 'Success');
          this.feedback = response.data;
          this.showFeedbackForm = false;
        } else {
          this.toastr.error(response.message, 'Error');
        }
      },
      error: (error) => {
        this.isSubmittingFeedback = false;
        this.toastr.error(error.error?.message || 'Failed to submit feedback', 'Error');
      }
    });
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase().replace('_', '-')}`;
  }
}
