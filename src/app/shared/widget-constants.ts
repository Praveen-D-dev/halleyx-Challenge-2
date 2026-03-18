import { WidgetConfig } from '../models/widget-config.model';

export const WIDGET_TYPES: WidgetConfig['type'][] = [
  'Bar chart',
  'Line chart',
  'Pie chart',
  'Area chart',
  'Scatter plot chart',
  'Table',
  'KPI'
];

export const getDefaultConfigForWidget = (type: string): WidgetConfig => {
  const baseConfig = { 
    type: type as WidgetConfig['type'], 
    title: 'Untitled', 
    dataSettings: {}, 
    styling: {} 
  };
  
  switch(type) {
    case 'KPI':
      return { 
        ...baseConfig, 
        width: 2, 
        height: 2, 
        dataSettings: { dataFormat: 'Number', decimalPrecision: 0 }
      } as WidgetConfig;
    case 'Table':
      return { 
        ...baseConfig, 
        width: 4, 
        height: 4, 
        styling: { fontSize: 14, headerBackground: '#54bd95' }
      } as WidgetConfig;
    case 'Pie chart':
      return { 
        ...baseConfig, 
        width: 4, 
        height: 4 
      } as WidgetConfig;
    default:
       // All other charts
       return { 
         ...baseConfig, 
         width: 5, 
         height: 5 
       } as WidgetConfig;
  }
};
