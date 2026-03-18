import { Component, Input, OnChanges, inject, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType, ChartData, Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { WidgetConfig } from '../../../models/widget-config.model';
import { CustomerOrder } from '../../../models/customer-order.model';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-chart-widget',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="chart-container" style="position: relative; height: 100%; width: 100%; padding: 8px;">
      <canvas *ngIf="isDataLoaded" baseChart
              [data]="chartData"
              [options]="chartOptions"
              [type]="chartType"
              [legend]="showLegend">
      </canvas>
      <div *ngIf="!isDataLoaded" class="placeholder-text">
         Configure data settings to view chart
      </div>
    </div>
  `,
  styles: [`
    .placeholder-text {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #999;
      font-size: 14px;
    }
  `]
})
export class ChartWidgetComponent implements OnChanges {
  @Input() config!: WidgetConfig;
  private apiService = inject(ApiService);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  
  isDataLoaded = false;
  
  public chartType: ChartType = 'bar';
  public showLegend = true;

  public chartData: ChartData<any> = {
    labels: [],
    datasets: [{ data: [], label: 'Series A' }]
  };

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true }
    }
  };

  // Map UI Labels to Object keys
  keyMap: any = {
    'Product': 'product',
    'Quantity': 'quantity',
    'Unit price': 'unitPrice',
    'Total amount': 'totalAmount',
    'Status': 'status',
    'Created by': 'createdBy'
  };

  ngOnChanges() {
    this.mapChartType();
    if (isPlatformBrowser(this.platformId)) {
      this.loadChartData();
    }
  }

  mapChartType() {
    switch (this.config.type) {
      case 'Bar chart': this.chartType = 'bar'; break;
      case 'Line chart': this.chartType = 'line'; break;
      case 'Pie chart': this.chartType = 'pie'; break;
      case 'Area chart': 
         this.chartType = 'line'; // Chart.js handles Area via filling a Line chart
         break;
      case 'Scatter plot chart': this.chartType = 'scatter'; break;
      default: this.chartType = 'bar';
    }
  }

  loadChartData() {
    if (this.config.type === 'Pie chart') {
      this.updatePieChart();
    } else {
      this.updateXYChart();
    }
  }

  updatePieChart() {
    const dataFieldUI = this.config.dataSettings?.chartData;
    if (!dataFieldUI) {
      this.isDataLoaded = false;
      return;
    }

    const fieldKey = this.keyMap[dataFieldUI];

    this.apiService.getOrders().subscribe((orders: CustomerOrder[]) => {
      // Group by fieldKey and count
      const counts: any = {};
      orders.forEach((o: any) => {
        const val = o[fieldKey] || 'Unknown';
        counts[val] = (counts[val] || 0) + 1;
      });

      this.showLegend = this.config.styling?.showLegend ?? true;

      this.chartData = {
        labels: Object.keys(counts),
        datasets: [{
          data: Object.values(counts),
          label: dataFieldUI
        }]
      };

      // Set Options
      this.chartOptions = {
        ...this.chartOptions,
        plugins: {
          legend: { display: this.showLegend }
        }
      };

      this.isDataLoaded = true;
      this.cdr.detectChanges();
    });
  }

  updateXYChart() {
    const xAxisUI = this.config.dataSettings?.xAxis;
    const yAxisUI = this.config.dataSettings?.yAxis;

    if (!xAxisUI || !yAxisUI) {
      this.isDataLoaded = false;
      return;
    }

    const xKey = this.keyMap[xAxisUI] || xAxisUI;
    const yKey = this.keyMap[yAxisUI] || yAxisUI;
    const color = this.config.styling?.chartColor || '#54bd95';

    this.apiService.getOrders().subscribe((orders: CustomerOrder[]) => {
       // A very simple aggregation: Map distinct X values, and sum their Y values.
       // In a real analytics app, you'd want robust pivot tables, but this gets the point across.
       
       const grouped: any = {};
       orders.forEach((o: any) => {
         const xVal = o[xKey] || 'Unknown';
         const yVal = Number(o[yKey]) || 0;
         
         grouped[xVal] = (grouped[xVal] || 0) + yVal;
       });

       const isArea = this.config.type === 'Area chart';

       this.chartData = {
         labels: Object.keys(grouped),
         datasets: [
           { 
             data: Object.values(grouped),
             label: yAxisUI,
             backgroundColor: color,
             borderColor: color,
             fill: isArea
           }
         ]
       };

       this.isDataLoaded = true;
       this.cdr.detectChanges();
    });
  }
}
