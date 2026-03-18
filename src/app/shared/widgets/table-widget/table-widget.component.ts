import { Component, Input, OnChanges, ViewChild, inject, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { WidgetConfig } from '../../../models/widget-config.model';
import { CustomerOrder } from '../../../models/customer-order.model';
import { ApiService } from '../../../services/api.service';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-table-widget',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  template: `
    <div class="table-container" [style.fontSize.px]="config.styling?.fontSize || 14">
      <table mat-table [dataSource]="dataSource" class="mat-elevation-z0" style="width: 100%;">
        
        <ng-container *ngFor="let col of mappedColumns" [matColumnDef]="col.label">
          <th mat-header-cell *matHeaderCellDef [style.backgroundColor]="config.styling?.headerBackground || '#54bd95'" style="color: white; font-weight: 600;">
            {{col.label}}
          </th>
          <td mat-cell *matCellDef="let element"> {{element[col.key]}} </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      <div *ngIf="dataSource.length === 0" style="padding: 16px; text-align: center; color: #888;">
        No data or columns selected
      </div>
    </div>
  `,
  styles: [`
    .table-container {
      height: 100%;
      overflow: auto;
      width: 100%;
    }
  `]
})
export class TableWidgetComponent implements OnChanges {
  @Input() config!: WidgetConfig;
  private apiService = inject(ApiService);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  
  dataSource: any[] = [];
  displayedColumns: string[] = [];
  mappedColumns: {key: string, label: string}[] = [];

  // Map UI Labels to Object keys
  keyMap: any = {
    'Customer ID': '_id',
    'Customer name': 'firstName', // simplifying concat for generic table
    'Email id': 'email',
    'Phone number': 'phone',
    'Address': 'streetAddress',
    'Order ID': '_id',
    'Order date': 'createdAt',
    'Product': 'product',
    'Quantity': 'quantity',
    'Unit price': 'unitPrice',
    'Total amount': 'totalAmount',
    'Status': 'status',
    'Created by': 'createdBy'
  };

  ngOnChanges() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadTableData();
    }
  }

  loadTableData() {
    const cols: string[] = this.config.dataSettings?.columns || [];
    if (cols.length === 0) {
      this.displayedColumns = [];
      this.mappedColumns = [];
      this.dataSource = [];
      return;
    }

    this.mappedColumns = cols.map(c => ({ key: this.keyMap[c] || c, label: c }));
    this.displayedColumns = this.mappedColumns.map(c => c.label);

    this.apiService.getOrders().subscribe((orders: CustomerOrder[]) => {
      let data = [...orders];

      // Sorting
      const sort = this.config.dataSettings?.sortBy;
      if (sort === 'Ascending') {
         data.sort((a: any, b: any) => (a.firstName > b.firstName) ? 1 : -1);
      } else if (sort === 'Descending') {
         data.sort((a: any, b: any) => (a.firstName < b.firstName) ? 1 : -1);
      } else if (sort === 'Order date') {
         data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      // Pagination Limit
      const limit = this.config.dataSettings?.pagination || 5;
      data = data.slice(0, limit);

      this.dataSource = data;
      this.cdr.detectChanges();
    });
  }
}
