"use client" 

import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';

import { config } from '@/config';
import { Budget } from '@/components/dashboard/overview/budget';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { Sales } from '@/components/dashboard/overview/sales';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { Traffic } from '@/components/dashboard/overview/traffic';
import { TotalProfitWeek } from '@/components/dashboard/overview/total-profit-week';
import { TotalProfitToday } from '@/components/dashboard/overview/total-profit-today';

const metadata: Metadata = { title: `Overview | Dashboard | ${config.site.name}` };

interface RevenueResponse {
  revenue: number;
}

interface OrdersResponse {
  count: number;
}

export default function Page(): React.ReactElement {
  const [thisMonthRevenue, setThisMonthRevenue] = React.useState<string | null>(null);
  const [thisWeekRevenue, setThisWeekRevenue] = React.useState<string | null>(null);
  const [todayRevenue, setTodayRevenue] = React.useState<string | null>(null);
  const [thisMonthOrders, setThisMonthOrders] = React.useState<string | null>(null);
  const [thisWeekOrders, setThisWeekOrders] = React.useState<string | null>(null);
  const [todaysOrders, setTodaysOrders] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchThisMonthRevenue(): Promise<void> {
      try {
        const response = await fetch('http://localhost:5000/api/revenue/thisMonth');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: RevenueResponse = await response.json();
        setThisMonthRevenue(`$${data.revenue}`);
      } catch (error) {
        console.error('Error fetching thisMonthRevenue:', error);
      }
    }

    async function fetchThisWeekRevenue(): Promise<void> {
      try {
        const response = await fetch('http://localhost:5000/api/revenue/thisWeek');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: RevenueResponse = await response.json();
        setThisWeekRevenue(`$${data.revenue}`);
      } catch (error) {
        console.error('Error fetching thisWeekRevenue:', error);
      }
    }

    async function fetchTodayRevenue(): Promise<void> {
      try {
        const response = await fetch('http://localhost:5000/api/revenue/today');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: RevenueResponse = await response.json();
        setTodayRevenue(`$${data.revenue}`);
      } catch (error) {
        console.error('Error fetching todayRevenue:', error);
      }
    }

    async function fetchThisMonthOrders(): Promise<void> {
      try {
        const response = await fetch('http://localhost:5000/api/orders/thisMonth');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: OrdersResponse = await response.json();
        setThisMonthOrders(`${data.count} orders`);
      } catch (error) {
        console.error('Error fetching thisMonthOrders:', error);
      }
    }

    async function fetchThisWeekOrders(): Promise<void> {
      try {
        const response = await fetch('http://localhost:5000/api/orders/thisWeek');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: OrdersResponse = await response.json();
        setThisWeekOrders(`${data.count} orders`);
      } catch (error) {
        console.error('Error fetching thisWeekOrders:', error);
      }
    }

    async function fetchTodaysOrders(): Promise<void> {
      try {
        const response = await fetch('http://localhost:5000/api/orders/today');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: OrdersResponse = await response.json();
        console.log(data); // Check what data is returned
        setTodaysOrders(`${data.count} orders`);
      } catch (error) {
        console.error('Error fetching todaysOrders:', error);
      }
    }

    fetchThisMonthRevenue();
    fetchThisWeekRevenue();
    fetchTodayRevenue();
    fetchThisMonthOrders();
    fetchThisWeekOrders();
    fetchTodaysOrders();
  }, []);

  return (
    <Grid container spacing={3}>
      
      <Grid container item spacing={3}>
        <Grid item lg={4} sm={6} xs={12}>
          <TotalProfit sx={{ height: '100%' }} value={thisMonthOrders} />
        </Grid>
        <Grid item lg={4} sm={6} xs={12}>
          <TotalProfitWeek sx={{ height: '100%' }} value={thisWeekOrders} />
        </Grid>
        <Grid item lg={4} sm={6} xs={12}>
          <TotalProfitToday sx={{ height: '100%' }} value={todaysOrders} />
        </Grid>
      </Grid>

      <Grid container item spacing={3}>
        <Grid item lg={4} sm={6} xs={12}>
          <Budget diff={12} trend="up" sx={{ height: '100%' }} value={thisMonthRevenue} />
        </Grid>
        <Grid item lg={4} sm={6} xs={12}>
          <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value={thisWeekRevenue} />
        </Grid>
        <Grid item lg={4} sm={6} xs={12}>
          <TasksProgress sx={{ height: '100%' }} value={todayRevenue} />
        </Grid>
      </Grid>
      <Grid item lg={8} xs={12}>
        <Sales
          chartSeries={[
            { name: 'This year', data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20] },
            { name: 'Last year', data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13] },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid item lg={4} md={6} xs={12}>
        <Traffic chartSeries={[63, 15, 22]} labels={['Desktop', 'Tablet', 'Phone']} sx={{ height: '100%' }} />
      </Grid>
      <Grid item lg={4} md={6} xs={12}>
        <LatestProducts
          products={[
            {
              id: 'PRD-005',
              name: 'Soja & Co. Eucalyptus',
              image: '/assets/product-5.png',
              updatedAt: dayjs().subtract(18, 'minutes').subtract(5, 'hour').toDate(),
            },
            {
              id: 'PRD-004',
              name: 'Necessaire Body Lotion',
              image: '/assets/product-4.png',
              updatedAt: dayjs().subtract(41, 'minutes').subtract(3, 'hour').toDate(),
            },
            {
              id: 'PRD-003',
              name: 'Ritual of Sakura',
              image: '/assets/product-3.png',
              updatedAt: dayjs().subtract(5, 'minutes').subtract(3, 'hour').toDate(),
            },
            {
              id: 'PRD-002',
              name: 'Lancome Rouge',
              image: '/assets/product-2.png',
              updatedAt: dayjs().subtract(23, 'minutes').subtract(2, 'hour').toDate(),
            },
            {
              id: 'PRD-001',
              name: 'Erbology Aloe Vera',
              image: '/assets/product-1.png',
              updatedAt: dayjs().subtract(10, 'minutes').toDate(),
            },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid item lg={8} md={12} xs={12}>
        <LatestOrders
          orders={[
            {
              id: 'ORD-007',
              customer: { name: 'Ekaterina Tankova' },
              amount: 30.5,
              status: 'pending',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-006',
              customer: { name: 'Cao Yu' },
              amount: 25.1,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-004',
              customer: { name: 'Alexa Richardson' },
              amount: 10.99,
              status: 'refunded',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-003',
              customer: { name: 'Anje Keizer' },
              amount: 96.43,
              status: 'pending',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-002',
              customer: { name: 'Clarke Gillebert' },
              amount: 32.54,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-001',
              customer: { name: 'Adam Denisov' },
              amount: 16.76,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
    </Grid>
  );
}
