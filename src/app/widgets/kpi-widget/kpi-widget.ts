import { Component, Input } from '@angular/core';
import { Widget } from '../../dashboard';

@Component({
  selector: 'app-kpi-widget',
  standalone: true,
  templateUrl: './kpi-widget.html',
  styleUrl: './kpi-widget.css'
})
export class KpiWidgetComponent {

  @Input() widget!: Widget;

}
