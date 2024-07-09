// pages/api/orders/today.js

import { mongooseConnect } from "@/lib/mongoose";

import { Order } from '@/pages/Order';
import dayjs from 'dayjs';

export default async function handler(req, res) {
  await  mongooseConnect();

  const startOfDay = dayjs().startOf('day').toDate();
  const endOfDay = dayjs().endOf('day').toDate();

  const ordersCount = await Order.countDocuments({
    createdAt: { $gte: startOfDay, $lt: endOfDay }
  });

  res.status(200).json({ count: ordersCount });
}
