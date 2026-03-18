import { Component, inject, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../../../services/api.service';
import { CustomerOrder } from '../../../models/customer-order.model';
import { OrderFormComponent } from '../order-form/order-form.component';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatMenuModule,
    MatDialogModule
  ],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  private apiService = inject(ApiService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  orders: CustomerOrder[] = [];
  displayedColumns: string[] = ['customerName', 'email', 'product', 'quantity', 'totalAmount', 'status', 'actions'];

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadOrders();
    }
  }

  loadOrders() {
    this.apiService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.cdr.detectChanges(); // Force detection to resolve NG0100
      },
      error: (err) => console.error('Error fetching orders', err)
    });
  }

  openOrderForm(order?: CustomerOrder) {
    const dialogRef = this.dialog.open(OrderFormComponent, {
      width: '600px',
      data: order ? { ...order } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadOrders(); // Reload orders after save
      }
    });
  }

  deleteOrder(id: string) {
    if (confirm('Are you sure you want to delete this order?')) {
      this.apiService.deleteOrder(id).subscribe({
        next: () => this.loadOrders(),
        error: (err) => console.error('Error deleting order', err)
      });
    }
  }
}
