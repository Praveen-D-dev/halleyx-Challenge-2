import { Component, Input } from '@angular/core';
import { Widget } from '../../dashboard';

@Component({
  selector: 'app-chart-widget',
  standalone: true,
  templateUrl: './chart-widget.html',
  styleUrl: './chart-widget.css'
})
export class ChartWidgetComponent {

  @Input() widget!: Widget;

}
