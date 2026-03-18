import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DashboardService } from '../../../services/dashboard.service';
import { WidgetConfig } from '../../../models/widget-config.model';

@Component({
  selector: 'app-widget-settings',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './widget-settings.component.html',
  styleUrls: ['./widget-settings.component.scss']
})
export class WidgetSettingsComponent {
  public dashboardService = inject(DashboardService);

  get widget(): WidgetConfig | null {
    return this.dashboardService.selectedWidget();
  }

  closePanel() {
    this.dashboardService.selectedWidget.set(null);
  }

  // Common data sources logic for inputs
  metricOptions = [
    'Customer ID', 'Customer name', 'Email id', 'Address', 
    'Order date', 'Product', 'Created by', 'Status', 
    'Total amount', 'Unit price', 'Quantity'
  ];

  aggregationOptions = ['Sum', 'Average', 'Count'];
  dataFormatOptions = ['Number', 'Currency'];
  
  // Chart specific
  axisOptions = ['Product', 'Quantity', 'Unit price', 'Total amount', 'Status', 'Created by', 'Duration'];
  
  // Table specific
  tableColumnOptions = [
    'Customer ID', 'Customer name', 'Email id', 'Phone number', 
    'Address', 'Order ID', 'Order date', 'Product', 'Quantity', 
    'Unit price', 'Total amount', 'Status', 'Created by'
  ];
  sortOptions = ['Ascending', 'Descending', 'Order date'];
  paginationOptions = [5, 10, 15];

}
