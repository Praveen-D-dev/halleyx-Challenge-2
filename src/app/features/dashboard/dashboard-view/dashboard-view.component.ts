import { Component, inject, HostListener, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { WidgetConfig } from '../../../models/widget-config.model';
import { ChartWidgetComponent } from '../../../shared/widgets/chart-widget/chart-widget.component';
import { KpiWidgetComponent } from '../../../shared/widgets/kpi-widget/kpi-widget.component';
import { TableWidgetComponent } from '../../../shared/widgets/table-widget/table-widget.component';
import { getDefaultConfigForWidget } from '../../../shared/widget-constants';

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [CommonModule, DragDropModule, ChartWidgetComponent, KpiWidgetComponent, TableWidgetComponent],
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss']
})
export class DashboardViewComponent implements OnInit {
  public dashboardService = inject(DashboardService);
  public router = inject(Router);
  private el = inject(ElementRef);

  ngOnInit() {
    this.dashboardService.loadDashboard();
  }

  isResizing = false;
  resizeStartIndex = -1;
  resizeStartWidth = 0;
  resizeStartHeight = 0;
  resizeStartMouseX = 0;
  resizeStartMouseY = 0;
  gridTotalWidth = 0;

  get isEditMode() {
    return this.router.url.includes('configure-dashboard');
  }

  get widgets() {
    return this.dashboardService.widgets();
  }

  getWidgetClasses(widget: WidgetConfig) {
    return `col-desk-${widget.width}`;
  }

  getWidgetStyles(widget: WidgetConfig) {
    return {
      'min-height': (widget.height || 4) * 40 + 'px'
    };
  }

  selectWidget(widget: WidgetConfig) {
    this.dashboardService.selectedWidget.set(widget);
  }

  deleteWidget(event: Event, widget: WidgetConfig, index: number) {
    event.stopPropagation();
    if(confirm('Are you sure you want to delete this widget?')) {
       this.dashboardService.removeWidget(widget._id, index);
    }
  }

  onResizeStart(event: MouseEvent, index: number, currentWidth: number, currentHeight: number) {
    if (!this.isEditMode) return;
    event.preventDefault();
    event.stopPropagation();

    this.isResizing = true;
    this.resizeStartIndex = index;
    this.resizeStartWidth = currentWidth;
    this.resizeStartHeight = currentHeight || 4;
    this.resizeStartMouseX = event.clientX;
    this.resizeStartMouseY = event.clientY;

    const gridContainer = this.el.nativeElement.querySelector('.grid-container');
    if (gridContainer) {
      this.gridTotalWidth = gridContainer.offsetWidth;
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isResizing) return;

    // Width resizing (12-column grid)
    const deltaX = event.clientX - this.resizeStartMouseX;
    const gridUnitWidth = this.gridTotalWidth / 12;
    const widthDelta = Math.round(deltaX / gridUnitWidth);
    let newWidth = this.resizeStartWidth + widthDelta;
    newWidth = Math.max(1, Math.min(12, newWidth));

    // Height resizing (40px increments)
    const deltaY = event.clientY - this.resizeStartMouseY;
    const heightDelta = Math.round(deltaY / 40);
    let newHeight = this.resizeStartHeight + heightDelta;
    newHeight = Math.max(2, Math.min(20, newHeight));

    const widgets = [...this.dashboardService.widgets()];
    const current = widgets[this.resizeStartIndex];
    
    if (current.width !== newWidth || current.height !== newHeight) {
      widgets[this.resizeStartIndex] = {
        ...current,
        width: newWidth,
        height: newHeight
      };
      this.dashboardService.widgets.set(widgets);
    }
  }

  @HostListener('window:mouseup')
  onMouseUp() {
    if (this.isResizing) {
      this.isResizing = false;
      this.resizeStartIndex = -1;
    }
  }

  onDrop(event: CdkDragDrop<any[]>) {
    if (!this.isEditMode) return;

    if (event.previousContainer === event.container) {
      // Reordering
      const currentWidgets = [...this.dashboardService.widgets()];
      moveItemInArray(currentWidgets, event.previousIndex, event.currentIndex);
      this.dashboardService.widgets.set(currentWidgets);
    } else {
      // New widget from sidebar
      const newType = event.previousContainer.data[event.previousIndex];
      const newConfig = getDefaultConfigForWidget(newType);
      
      const currentWidgets = [...this.dashboardService.widgets()];
      currentWidgets.splice(event.currentIndex, 0, newConfig);
      this.dashboardService.widgets.set(currentWidgets);
    }
  }
}
