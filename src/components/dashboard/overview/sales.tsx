'use client';

import * as React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import { ArrowClockwise as ArrowClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import type { ChartData, ChartOptions } from 'chart.js';

export interface SalesProps {
  chartSeries: { name: string; data: number[] }[];
  sx?: SxProps;
}

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function Sales({ chartSeries, sx }: SalesProps): React.JSX.Element {
  const chartOptions = useChartOptions();
  const chartData = useChartData(chartSeries);

  return (
    <Card sx={sx}>
      <CardHeader
        action={
          <Button color="inherit" size="small" startIcon={<ArrowClockwiseIcon fontSize="var(--icon-fontSize-md)" />}>
            Sync
          </Button>
        }
        title="Sales"
      />
      <CardContent>
        <Line data={chartData} options={chartOptions} />
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button color="inherit" endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />} size="small">
          Overview
        </Button>
      </CardActions>
    </Card>
  );
}

function useChartOptions(): ChartOptions<'line'> {
  const theme = useTheme();

  return {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            return `${label}: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Time Period',
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Revenue/Orders',
        },
        grid: {
          display: true,
          color: theme.palette.divider,
        },
      },
    },
    elements: {
      line: {
        tension: 0.4, // Smooth lines
        borderWidth: 2,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  };
}

function useChartData(chartSeries: { name: string; data: number[] }[]): ChartData<'line'> {
  const theme = useTheme();
  
  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
  ];

  return {
    labels: ['Today', 'This Week', 'This Month'],
    datasets: chartSeries.map((series, index) => ({
      label: series.name,
      data: series.data,
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length],
      fill: true,
      tension: 0.4, // Smooth lines
    })),
  };
}
