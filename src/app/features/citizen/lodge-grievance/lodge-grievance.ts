import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from '../../../shared/components/header/header';
import { GrievanceService } from '../../../core/services/grievance.service';
import { DepartmentService } from '../../../core/services/department.service';
import { Category, Department, SubCategory } from '../../../core/models/grievance.model';

@Component({
  selector: 'app-lodge-grievance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    HeaderComponent
  ],
  templateUrl: './lodge-grievance.html',
  styleUrl: './lodge-grievance.scss'
})
export class LodgeGrievanceComponent implements OnInit {
  grievanceForm: FormGroup;
  isLoading = false;
  isSubmitting = false;

  departments: Department[] = [];
  categories: Category[] = [];
  subCategories: SubCategory[] = [];

  selectedDepartment: Department | null = null;
  selectedCategory: Category | null = null;
  selectedSubCategory: SubCategory | null = null;

  constructor(
    private fb: FormBuilder,
    private grievanceService: GrievanceService,
    private departmentService: DepartmentService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.grievanceForm = this.fb.group({
      departmentId: ['', Validators.required],
      categoryId: ['', Validators.required],
      subCategoryId: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(2000)]]
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load departments', 'Error');
        this.isLoading = false;
      }
    });
  }

  onDepartmentChange(event: any): void {
    const departmentId = event.value;
    this.selectedDepartment = this.departments.find(d => d.id === departmentId) || null;
    this.categories = [];
    this.subCategories = [];
    this.selectedCategory = null;
    this.selectedSubCategory = null;
    this.grievanceForm.patchValue({ categoryId: '', subCategoryId: '' });

    if (departmentId) {
      this.departmentService.getCategoriesByDepartment(departmentId).subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: () => {
          this.toastr.error('Failed to load categories', 'Error');
        }
      });
    }
  }

  onCategoryChange(event: any): void {
    const categoryId = event.value;
    this.selectedCategory = this.categories.find(c => c.id === categoryId) || null;
    this.subCategories = [];
    this.selectedSubCategory = null;
    this.grievanceForm.patchValue({ subCategoryId: '' });

    if (categoryId) {
      this.departmentService.getSubCategoriesByCategory(categoryId).subscribe({
        next: (subCategories) => {
          this.subCategories = subCategories;
        },
        error: () => {
          this.toastr.error('Failed to load sub-categories', 'Error');
        }
      });
    }
  }

  onSubCategoryChange(event: any): void {
    const subCategoryId = event.value;
    this.selectedSubCategory = this.subCategories.find(sc => sc.id === subCategoryId) || null;
  }

  onSubmit(): void {
    if (this.grievanceForm.invalid) {
      this.grievanceForm.markAllAsTouched();
      return;
    }

    if (!this.selectedDepartment || !this.selectedCategory || !this.selectedSubCategory) {
      this.toastr.error('Please select all required fields', 'Error');
      return;
    }

    this.isSubmitting = true;

    const request = {
      departmentId: this.selectedDepartment.id,
      departmentName: this.selectedDepartment.name,
      categoryId: this.selectedCategory.id,
      categoryName: this.selectedCategory.name,
      subCategoryId: this.selectedSubCategory.id,
      subCategoryName: this.selectedSubCategory.name,
      slaHours: this.selectedSubCategory.slaHours,
      title: this.grievanceForm.value.title,
      description: this.grievanceForm.value.description
    };

    this.grievanceService.createGrievance(request).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.success) {
          this.toastr.success(`Grievance ${response.data.grievanceNumber} submitted successfully!`, 'Success');
          this.router.navigate(['/citizen/my-grievances']);
        } else {
          this.toastr.error(response.message, 'Error');
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.toastr.error(error.error?.message || 'Failed to submit grievance', 'Error');
      }
    });
  }
}
