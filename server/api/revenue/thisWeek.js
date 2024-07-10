// pages/api/revenue/thisWeek.js

import { mongooseConnect } from '../../lib/mongoose.js';
import Order from '../../models/order.js';
import dayjs from 'dayjs';

export default async function thisWeekRevenueHandler(req, res) {
  console.log('thisWeek.js handler called');  // Add this line
  await mongooseConnect();

  const startOfWeek = dayjs().startOf('week').toDate();
  const endOfWeek = dayjs().endOf('week').toDate();

  const orders = await Order.find({
    createdAt: { $gte: startOfWeek, $lt: endOfWeek },
    
  });

  const totalRevenue = orders.reduce((acc, order) => {
    const orderRevenue = order.line_items.reduce((lineAcc, item) => {
      return lineAcc + (item.price_data.unit_amount * item.quantity / 100); // unit_amount is in cents
    }, 0);
    return acc + orderRevenue;
  }, 0);

  res.status(200).json({ revenue: totalRevenue });
}
