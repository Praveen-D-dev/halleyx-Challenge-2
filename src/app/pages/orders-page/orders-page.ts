import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderListComponent } from '../../features/customer-orders/order-list/order-list.component';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CommonModule, OrderListComponent],
  templateUrl: './orders-page.html',
  styleUrl: './orders-page.css'
})
export class OrdersPageComponent {

}

