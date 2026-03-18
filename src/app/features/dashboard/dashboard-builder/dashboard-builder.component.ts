import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DashboardViewComponent } from '../dashboard-view/dashboard-view.component';
import { WidgetSettingsComponent } from '../widget-settings/widget-settings.component';
import { DashboardService } from '../../../services/dashboard.service';
import { WIDGET_TYPES } from '../../../shared/widget-constants';

@Component({
  selector: 'app-dashboard-builder',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    DashboardViewComponent,
    WidgetSettingsComponent
  ],
  templateUrl: './dashboard-builder.component.html',
  styleUrls: ['./dashboard-builder.component.scss']
})
export class DashboardBuilderComponent implements OnInit {
  public dashboardService = inject(DashboardService);

  availableWidgets = WIDGET_TYPES;

  ngOnInit() {
    this.dashboardService.loadDashboard();
  }

  saveConfig() {
    this.dashboardService.saveDashboard();
    // In a real app, maybe navigate away or show success notification
    alert('Dashboard saved successfully!');
  }
}
