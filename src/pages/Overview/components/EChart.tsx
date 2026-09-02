import { ScatterChart } from 'echarts/charts';
import {
  GridComponent,
  MarkLineComponent,
  TooltipComponent,
} from 'echarts/components';
import type { EChartsCoreOption } from 'echarts/core';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useEffect, useRef } from 'react';

echarts.use([
  ScatterChart,
  GridComponent,
  TooltipComponent,
  MarkLineComponent,
  CanvasRenderer,
]);

/** The subset of an ECharts `'click'` param object the charts here rely on. */
export interface EChartClickParams {
  componentType: string;
  seriesIndex?: number;
  dataIndex: number;
  name: string;
  value: unknown;
  data: unknown;
}

interface Props {
  option: EChartsCoreOption;
  className?: string;
  height?: number;
  /** Fires when a data mark (bar, point) is clicked. */
  onClick?: (params: EChartClickParams) => void;
}

/**
 * Thin wrapper around the raw ECharts API: create the instance on mount,
 * push options when they change, keep it sized to its container, forward
 * click events, and dispose on unmount. No react wrapper library.
 */
export const EChart = ({ option, className, height = 260, onClick }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof echarts.init> | null>(null);

  // Keep the latest click handler reachable without re-initializing the chart.
  const onClickRef = useRef(onClick);

  useEffect(() => {
    onClickRef.current = onClick;
  });

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const chart = echarts.init(containerRef.current);
    chartRef.current = chart;

    chart.on('click', (params) =>
      onClickRef.current?.(params as EChartClickParams),
    );

    const resize = () => chart.resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(option, true);
  }, [option]);

  return <div ref={containerRef} className={className} style={{ height }} />;
};
