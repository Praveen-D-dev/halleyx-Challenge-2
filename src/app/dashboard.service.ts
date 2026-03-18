import { Injectable, signal } from "@angular/core";

export interface Widget{
  id: number;
  label: string;
  type: string;
  cols: number;
  rows: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService{
  widgets=signal<Widget[]>([
    {id:1, label: 'Total Sales', type: 'KPI', cols: 4, rows: 2},
    {id:2, label: 'Monthly Growth', type: 'CHART', cols: 8, rows: 4},
    {id:3, label: 'Recently Orders', type: 'TABLE', cols: 12, rows: 4}
  ]);

  removeWidget(id: number){
    this.widgets.update(currentWidgets =>
      currentWidgets.filter(w=> w.id != id)
    );
  }
}
