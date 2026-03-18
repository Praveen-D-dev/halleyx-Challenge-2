import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerOrder } from '../models/customer-order.model';
import { WidgetConfig } from '../models/widget-config.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Customer Orders
  getOrders(): Observable<CustomerOrder[]> {
    return this.http.get<CustomerOrder[]>(`${this.apiUrl}/orders`);
  }

  createOrder(order: CustomerOrder): Observable<CustomerOrder> {
    return this.http.post<CustomerOrder>(`${this.apiUrl}/orders`, order);
  }

  updateOrder(id: string, order: CustomerOrder): Observable<CustomerOrder> {
    return this.http.put<CustomerOrder>(`${this.apiUrl}/orders/${id}`, order);
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/orders/${id}`);
  }

  // Dashboard Configuration
  getDashboardConfig(): Observable<WidgetConfig[]> {
    return this.http.get<WidgetConfig[]>(`${this.apiUrl}/dashboard/config`);
  }

  saveBulkDashboardConfig(widgets: WidgetConfig[]): Observable<WidgetConfig[]> {
    return this.http.post<WidgetConfig[]>(`${this.apiUrl}/dashboard/config/bulk`, { widgets });
  }
}
