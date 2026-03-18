import { Component, Input, OnChanges, inject, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { WidgetConfig } from '../../../models/widget-config.model';
import { CustomerOrder } from '../../../models/customer-order.model';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-kpi-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="kpi-container">
      <div class="kpi-value">{{ formattedValue }}</div>
      <div class="kpi-metric">{{ config.dataSettings?.metric || 'No metric selected' }}</div>
    </div>
  `,
  styles: [`
    .kpi-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
    }
    .kpi-value {
      font-size: 32px;
      font-weight: bold;
      color: #333;
      margin-bottom: 8px;
    }
    .kpi-metric {
      font-size: 14px;
      color: #777;
    }
  `]
})
export class KpiWidgetComponent implements OnChanges {
  @Input() config!: WidgetConfig;
  private apiService = inject(ApiService);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  
  rawValue: number = 0;
  formattedValue: string = '0';

  ngOnChanges() {
    if (isPlatformBrowser(this.platformId)) {
      this.calculateKPI();
    }
  }

  calculateKPI() {
    this.apiService.getOrders().subscribe((orders: CustomerOrder[]) => {
      const metric = this.config.dataSettings?.metric;
      const agg = this.config.dataSettings?.aggregation;
      
      if (!metric || !agg || orders.length === 0) {
        this.formattedValue = '0';
        return;
      }

      // Map metric UI names to object keys
      const keyMap: any = {
        'Quantity': 'quantity',
        'Unit price': 'unitPrice',
        'Total amount': 'totalAmount'
      };

      const field = keyMap[metric];
      
      if (!field && agg !== 'Count') {
         this.formattedValue = 'N/A';
         return;
      }

      let result = 0;
      
      if (agg === 'Count') {
        result = orders.length; // Basic count of dataset if no specific filter
      } else if (agg === 'Sum') {
        result = orders.reduce((acc: number, val: CustomerOrder) => acc + (Number(val[field as keyof CustomerOrder]) || 0), 0);
      } else if (agg === 'Average') {
        const sum = orders.reduce((acc: number, val: CustomerOrder) => acc + (Number(val[field as keyof CustomerOrder]) || 0), 0);
        result = sum / orders.length;
      }

      this.rawValue = result;
      this.formatValue();
      this.cdr.detectChanges();
    });
  }

  formatValue() {
    const format = this.config.dataSettings?.dataFormat || 'Number';
    const decimals = this.config.dataSettings?.decimalPrecision || 0;

    let val = this.rawValue;
    if (format === 'Currency') {
      this.formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(val);
    } else {
      this.formattedValue = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(val);
    }
  }
}
