import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  roles = [
    { value: UserRole.CITIZEN, label: 'Citizen' },
    { value: UserRole.DEPARTMENT_OFFICER, label: 'Department Officer' },
    { value: UserRole.SUPERVISORY_OFFICER, label: 'Supervisory Officer' },
    { value: UserRole.SYSTEM_ADMIN, label: 'System Admin' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      aadhaarNumber: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
      role: [UserRole.CITIZEN, Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.errors?.['passwordMismatch']) {
      confirmPassword.setErrors(null);
    }
    return null;
  }

  onSubmit(): void {
  if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched();
    return;
  }

  this.isLoading = true;
  const { confirmPassword, ...registerData } = this.registerForm.value;

  this.authService.register(registerData).subscribe({
    next: (response: any) => {
      this.isLoading = false;
      // Backend returns { message, token, role, userId } on success
      // No 'success' field, so we check if userId exists
      if (response && (response.userId || response.message?.toLowerCase().includes('successful'))) {
        this.toastr.success('Registration successful! Please login.', 'Success');
        this.router.navigate(['/login']);
      } else {
        this.toastr.error(response.message || 'Registration failed', 'Error');
      }
    },
    error: (error) => {
      this.isLoading = false;
      const errorMessage = error.error?.message || error.message || 'Registration failed. Please try again.';
      this.toastr.error(errorMessage, 'Error');
    }
  });
}
}
