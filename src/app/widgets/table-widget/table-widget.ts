import { Component, Input } from '@angular/core';
import { Widget } from '../../dashboard';

@Component({
  selector: 'app-table-widget',
  standalone: true,
  templateUrl: './table-widget.html',
  styleUrl: './table-widget.css'
})
export class TableWidgetComponent {

  @Input() widget!: Widget;

}
