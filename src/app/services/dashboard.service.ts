import { Injectable, signal, inject } from '@angular/core';
import { WidgetConfig } from '../models/widget-config.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiService = inject(ApiService);
  
  // State for widgets on the canvas
  widgets = signal<WidgetConfig[]>([]);
  
  // Currently selected widget for settings panel
  selectedWidget = signal<WidgetConfig | null>(null);

  constructor() {}

  loadDashboard() {
    this.apiService.getDashboardConfig().subscribe({
      next: (data) => this.widgets.set(data),
      error: (err) => console.error('Failed to load dashboard', err)
    });
  }

  addWidget(widget: WidgetConfig) {
    this.widgets.update(current => [...current, widget]);
  }

  removeWidget(widgetId: string | undefined, index: number) {
    this.widgets.update(current => {
      const updated = [...current];
      updated.splice(index, 1);
      return updated;
    });
    // If the removed widget was selected, deselect it
    if (this.selectedWidget() === this.widgets()[index]) {
      this.selectedWidget.set(null);
    }
  }

  updateWidget(index: number, updatedWidget: WidgetConfig) {
    this.widgets.update(current => {
      const updated = [...current];
      updated[index] = updatedWidget;
      return updated;
    });
    // Update selected ref if modifying the selected widget
    if (this.selectedWidget() === this.widgets()[index]) {
       this.selectedWidget.set(updatedWidget);
    }
  }

  saveDashboard() {
    this.apiService.saveBulkDashboardConfig(this.widgets()).subscribe({
       next: (data) => {
         console.log('Dashboard saved successfully');
         this.widgets.set(data);
       },
       error: (err) => console.error('Failed to save dashboard', err)
    });
  }
}
