import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // private apiUrl = 'http://localhost:3000/users';
  private apiUrl = 'https://localhost:7137/api/User';

  constructor(private http: HttpClient) {}

  // Create operation
  create(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  // Read operation
  get(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Read all operation
  getAll() {
    return this.http.get(`${this.apiUrl}`);
  }

  // Update operation
  update(id: number, data: any) {
    console.log(id);
    console.log(data);
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Delete operation
  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
