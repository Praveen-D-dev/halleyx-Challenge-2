import { Component, inject } from '@angular/core';
import { Dashboard } from '../dashboard';
import { CommonModule } from '@angular/common';
import { KpiWidgetComponent } from '../widgets/kpi-widget/kpi-widget';
import { ChartWidgetComponent } from '../widgets/chart-widget/chart-widget';
import { TableWidgetComponent } from '../widgets/table-widget/table-widget';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  dashboardService = inject(Dashboard);
  widgets = this.dashboardService.widgets;
}
