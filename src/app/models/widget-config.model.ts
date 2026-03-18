export interface WidgetConfig {
  _id?: string;
  title: string;
  type: 'KPI' | 'Bar chart' | 'Line chart' | 'Area chart' | 'Scatter plot chart' | 'Pie chart' | 'Table';
  description?: string;
  width: number; // Columns
  height: number; // Rows
  x?: number; // X position in grid
  y?: number; // Y position in grid

  dataSettings?: any;
  styling?: any;
}
