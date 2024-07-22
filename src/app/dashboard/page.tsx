/* eslint-disable */
"use client"

import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress for a spinner

import { Budget } from '@/components/dashboard/overview/budget';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { LatestProductsContainer } from '@/components/dashboard/overview/latest-products';
import { Sales } from '@/components/dashboard/overview/sales';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { TotalProfitWeek } from '@/components/dashboard/overview/total-profit-week';
import { TotalProfitToday } from '@/components/dashboard/overview/total-profit-today';

interface DashboardData {
  orders: {
    month: number;
    week: number;
    day: number;
  };
  revenue: {
    month: number;
    week: number;
    day: number;
  };
}

const Page: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data: DashboardData = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    }

    void fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress /> {/* Show loading spinner */}
      </div>
    );
  }

  if (!data) {
    return <div>Failed to load data</div>; // Handle case where data is not available
  }

  return (
    <Grid container spacing={3}>
      <Grid container item spacing={3}>
        <Grid item lg={4} sm={6} xs={12}>
          <TotalProfit sx={{ height: '100%' }} value={data.orders.month.toString()} />
        </Grid>
        <Grid item lg={4} sm={6} xs={12}>
          <TotalProfitWeek sx={{ height: '100%' }} value={data.orders.week.toString()} />
        </Grid>
        <Grid item lg={4} sm={6} xs={12}>
          <TotalProfitToday sx={{ height: '100%' }} value={data.orders.day.toString()} />
        </Grid>
      </Grid>

      <Grid container item spacing={3}>
        <Grid item lg={4} sm={6} xs={12}>
          <Budget diff={12} trend="up" sx={{ height: '100%' }} value={`$${data.revenue.month.toFixed(2)}`} />
        </Grid>
        <Grid item lg={4} sm={6} xs={12}>
          <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value={`$${data.revenue.week.toFixed(2)}`} />
        </Grid>
        <Grid item lg={4} sm={6} xs={12}>
          <TasksProgress sx={{ height: '100%' }} value={Number(data.revenue.day.toFixed(2))} />
        </Grid>
      </Grid>

      <Grid item lg={8} xs={12}>
        <Sales
          chartSeries={[
            { name: 'This month - Revenue', data: [data.revenue.month, 0, 0] },
            { name: 'This week - Revenue', data: [0, data.revenue.week, 0] },
            { name: 'Today - Revenue', data: [0, 0, data.revenue.day] },
            { name: 'This month - Orders', data: [data.orders.month, 0, 0] },
            { name: 'This week - Orders', data: [0, data.orders.week, 0] },
            { name: 'Today - Orders', data: [0, 0, data.orders.day] },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>

      <Grid item lg={4} md={6} xl={3} xs={12}>
        <LatestProductsContainer />
      </Grid>
      <Grid item lg={8} md={12} xl={9} xs={12}>
        <LatestOrders />
      </Grid>
    </Grid>
  );
};

export default Page;
