// server/api/revenue/thisMonth.js

import { mongooseConnect } from '../../lib/mongoose.js'; // Adjusted import path
import Order from '../../models/order.js'; // Adjusted import path
import dayjs from 'dayjs';

export default async function thisMonthRevenueHandler(req, res) {
  try {
    await mongooseConnect();

    // Calculate start and end of the current month
    const startOfMonth = dayjs().startOf('month').toDate();
    const endOfMonth = dayjs().endOf('month').toDate();

    // Query orders within the current month that are paid
    const orders = await Order.find({
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
      
    });

    // Calculate total revenue from the fetched orders
    const totalRevenue = orders.reduce((acc, order) => {
      const orderRevenue = order.line_items.reduce((lineAcc, item) => {
        return lineAcc + (item.price_data.unit_amount * item.quantity / 100); // unit_amount is in cents
      }, 0);
      return acc + orderRevenue;
    }, 0);

    // Respond with the total revenue as JSON
    res.status(200).json({ revenue: totalRevenue });
  } catch (error) {
    // Handle errors if any occur during the process
    console.error('Error fetching revenue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
