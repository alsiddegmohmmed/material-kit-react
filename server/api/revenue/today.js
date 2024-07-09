// pages/api/revenue/today.js

import { mongooseConnect } from '../../lib/mongoose.js';
import Order from '../../models/order.js';
import dayjs from 'dayjs';

export default async function todayRevenueHandler(req, res) {
    await mongooseConnect();
  
    const startOfDay = dayjs().startOf('day').toDate();
    const endOfDay = dayjs().endOf('day').toDate();
  
    const orders = await Order.find({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
      paid: true,
    });
  
    const totalRevenue = orders.reduce((acc, order) => {
      const orderRevenue = order.line_items.reduce((lineAcc, item) => {
        return lineAcc + (item.price_data.unit_amount * item.quantity / 100); // unit_amount is in cents
      }, 0);
      return acc + orderRevenue;
    }, 0);
  
    res.status(200).json({ revenue: totalRevenue });
  }