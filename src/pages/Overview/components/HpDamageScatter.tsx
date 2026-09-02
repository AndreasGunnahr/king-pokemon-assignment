import type { EChartsCoreOption } from 'echarts/core';
import { useMemo } from 'react';

import { getMedian, type ScatterPoint } from '@/lib/derive';
import { typeColor } from '@/lib/typeColors';

import { EChart } from './EChart';
import { axisStyle, useThemeTokens } from './useThemeTokens';

interface Props {
  points: ScatterPoint[];
  activeType?: string;
  /** Fires with the clicked point's type (toggles the table filter upstream). */
  onSelect?: (type: string) => void;
}

interface PointDatum {
  value: [number, number];
  name: string;
  type: string;
}

/** HP vs. max attack damage, one dot per Pokémon card, colored by energy type,
 *  with median reference lines. Clicking a dot filters by its type. */
export const HpDamageScatter = ({ points, activeType, onSelect }: Props) => {
  const themeTokens = useThemeTokens();

  const option = useMemo<EChartsCoreOption>(() => {
    const axis = axisStyle(themeTokens);

    // Medians follow the selected type: when a color is active they describe
    // that subset and the lines take its color, otherwise the whole set.
    const typed = activeType ? points.filter((p) => p.type === activeType) : [];
    const scoped = activeType && typed.length ? typed : points;
    const medianHp = Math.round(getMedian(scoped.map((p) => p.hp)));
    const medianDmg = Math.round(getMedian(scoped.map((p) => p.damage)));
    const medianColor =
      activeType && typed.length ? typeColor(activeType) : themeTokens.muted;
    const medLabel = activeType && typed.length ? activeType : 'median';

    return {
      grid: { left: 52, right: 20, top: 24, bottom: 40 },
      tooltip: {
        trigger: 'item',
        formatter: (p: { data: PointDatum }) =>
          `${p.data.name}<br/>${p.data.type} · HP ${p.data.value[0]} · ${p.data.value[1]} damage`,
      },
      xAxis: {
        ...axis,
        name: 'HP',
        nameLocation: 'middle',
        nameGap: 24,
        splitLine: { show: false },
      },
      yAxis: {
        ...axis,
        name: 'Max damage',
        nameLocation: 'middle',
        nameGap: 34,
      },
      series: [
        {
          type: 'scatter',
          symbolSize: 6,
          cursor: onSelect ? 'pointer' : 'default',
          data: points.map<
            PointDatum & { itemStyle: { color: string; opacity: number } }
          >((p) => ({
            value: [p.hp, p.damage],
            name: p.name,
            type: p.type,
            itemStyle: {
              color: typeColor(p.type),
              opacity: !activeType || activeType === p.type ? 0.8 : 0.2,
            },
          })),
          markLine: {
            silent: true,
            symbol: 'none',
            lineStyle: { color: medianColor, type: 'dashed', opacity: 0.8 },
            // `inside*` positions are clamped to the plot area. Each line is
            // labeled beside its own axis (HP line at the bottom, damage line
            // at the left). `align:left` grows the text inward.
            label: {
              color: medianColor,
              fontSize: 10,
            },
            data: [
              {
                xAxis: medianHp,
                label: {
                  formatter: `${medLabel} HP ${medianHp}`,
                  position: 'insideEndTop',
                },
              },
              {
                yAxis: medianDmg,
                label: {
                  formatter: `${medLabel} dmg ${medianDmg}`,
                  position: 'insideEndTop',
                },
              },
            ],
          },
        },
      ],
    };
  }, [points, activeType, onSelect, themeTokens]);

  return (
    <EChart
      option={option}
      height={300}
      onClick={
        onSelect
          ? (p) => {
              const datum = p.data as PointDatum | undefined;

              if (datum?.type) {
                onSelect(datum.type);
              }
            }
          : undefined
      }
    />
  );
};
