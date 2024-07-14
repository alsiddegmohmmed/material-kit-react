/* eslint-disable */

import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';

import { Budget } from '@/components/dashboard/overview/budget';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { LatestProductsContainer } from '@/components/dashboard/overview/latest-products';
import { Sales } from '@/components/dashboard/overview/sales';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { TotalProfitWeek } from '@/components/dashboard/overview/total-profit-week';
import { TotalProfitToday } from '@/components/dashboard/overview/total-profit-today';

interface RevenueResponse {
  revenue: number;
}

interface OrdersResponse {
  count: number;
}

const Page: React.FC = () => {
  const [thisMonthRevenue, setThisMonthRevenue] = useState<number | null>(null);
  const [thisWeekRevenue, setThisWeekRevenue] = useState<number | null>(null);
  const [todayRevenue, setTodayRevenue] = useState<number | null>(null);
  const [thisMonthOrders, setThisMonthOrders] = useState<number | null>(null);
  const [thisWeekOrders, setThisWeekOrders] = useState<number | null>(null);
  const [todaysOrders, setTodaysOrders] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const thisMonthRevenueResponse = await fetch('http://localhost:5000/api/revenue/thisMonth');
        const thisWeekRevenueResponse = await fetch('http://localhost:5000/api/revenue/thisWeek');
        const todayRevenueResponse = await fetch('http://localhost:5000/api/revenue/today');
        const thisMonthOrdersResponse = await fetch('http://localhost:5000/api/orders/thisMonth');
        const thisWeekOrdersResponse = await fetch('http://localhost:5000/api/orders/thisWeek');
        const todaysOrdersResponse = await fetch('http://localhost:5000/api/orders/today');

        if (!thisMonthRevenueResponse.ok || !thisWeekRevenueResponse.ok || !todayRevenueResponse.ok || !thisMonthOrdersResponse.ok || !thisWeekOrdersResponse.ok || !todaysOrdersResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const thisMonthRevenueData: RevenueResponse = await thisMonthRevenueResponse.json();
        const thisWeekRevenueData: RevenueResponse = await thisWeekRevenueResponse.json();
        const todayRevenueData: RevenueResponse = await todayRevenueResponse.json();
        const thisMonthOrdersData: OrdersResponse = await thisMonthOrdersResponse.json();
        const thisWeekOrdersData: OrdersResponse = await thisWeekOrdersResponse.json();
        const todaysOrdersData: OrdersResponse = await todaysOrdersResponse.json();

        setThisMonthRevenue(thisMonthRevenueData.revenue);
        setThisWeekRevenue(thisWeekRevenueData.revenue);
        setTodayRevenue(todayRevenueData.revenue);
        setThisMonthOrders(thisMonthOrdersData.count);
        setThisWeekOrders(thisWeekOrdersData.count);
        setTodaysOrders(todaysOrdersData.count);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    void fetchData();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid container item spacing={3}>
        <Grid item lg={4} sm={6} xs={12}>
          <TotalProfit sx={{ height: '100%' }} value={thisMonthOrders?.toString() ?? ''} />
        </Grid>
        <Grid item lg={4} sm={6} xs={12}>
          <TotalProfitWeek sx={{ height: '100%' }} value={thisWeekOrders?.toString() ?? ''} />
        </Grid>
        <Grid item lg={4} sm={6} xs={12}>
          <TotalProfitToday sx={{ height: '100%' }} value={todaysOrders?.toString() ?? ''} />
        </Grid>
      </Grid>

      <Grid container item spacing={3}>
        <Grid item lg={4} sm={6} xs={12}>
          <Budget diff={12} trend="up" sx={{ height: '100%' }} value={`$${thisMonthRevenue?.toFixed(2)}`} />
        </Grid>
        <Grid item lg={4} sm={6} xs={12}>
          <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value={`$${thisWeekRevenue?.toFixed(2)}`} />
        </Grid>
        <Grid item lg={4} sm={6} xs={12}>
          <TasksProgress sx={{ height: '100%' }} value={Number(todayRevenue?.toFixed(2))} />
        </Grid>
      </Grid>

      <Grid item lg={8} xs={12}>
        <Sales
          chartSeries={[
            { name: 'This month - Revenue', data: [thisMonthRevenue || 0, 0, 0] },
            { name: 'This week - Revenue', data: [0, thisWeekRevenue || 0, 0] },
            { name: 'Today - Revenue', data: [0, 0, todayRevenue || 0] },
            { name: 'This month - Orders', data: [thisMonthOrders || 0, 0, 0] },
            { name: 'This week - Orders', data: [0, thisWeekOrders || 0, 0] },
            { name: 'Today - Orders', data: [0, 0, todaysOrders || 0] },
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
