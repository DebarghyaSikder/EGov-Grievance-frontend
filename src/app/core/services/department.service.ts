import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, Department, SubCategory } from '../models/grievance.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private jsonServerUrl = environment.jsonServerUrl;

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.jsonServerUrl}/departments`);
  }

  getCategoriesByDepartment(departmentId: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.jsonServerUrl}/categories?departmentId=${departmentId}`);
  }

  getSubCategoriesByCategory(categoryId: number): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(`${this.jsonServerUrl}/subcategories?categoryId=${categoryId}`);
  }
}
