import { NumberSymbol } from '@angular/common';
import { Injectable,signal } from '@angular/core';

export interface Widget{
  id: number;
  label: string;
  type: string;
  cols: number;
  rows: number;
}

@Injectable({
  providedIn: 'root',
})
export class Dashboard {

  widgets=signal<Widget[]>([
    {id:1, label:'Total Revenue', type:'KPI', cols:4, rows:2},
    {id:2, label:'Sales Chart', type:'CHART', cols:8, rows:4},
    {id:3, label:'Recent Orders', type:'TABLE', cols:12, rows:4}
  ]);

  updateWidget(id: number, newcols: number, newrows: number){
    this.widgets.update(allWidgets =>
      allWidgets.map(w =>
        w.id === id ? {...w, cols: newcols, rows: newrows}: w
      )
    );
  }

  removeWidget(id: number){
    this.widgets.update(currentWidget=>
      currentWidget.filter(w=>w.id != id)
    );
  }
}
