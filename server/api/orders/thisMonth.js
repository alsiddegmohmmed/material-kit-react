// pages/api/orders/thisMonth.js

import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "../../../models/order";
import dayjs from 'dayjs';

export default async function handler(req, res) {
  await mongooseConnect();

  const startOfMonth = dayjs().startOf('month').toDate();
  const endOfMonth = dayjs().endOf('month').toDate();

  const ordersCount = await Order.countDocuments({
    createdAt: { $gte: startOfMonth, $lt: endOfMonth }
  });

  res.status(200).json({ count: ordersCount });
}
