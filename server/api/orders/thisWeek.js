// pages/api/orders/thisWeek.js

import { mongooseConnect } from "../../lib/mongoose.js";
import Order from "../../models/order.js";
import dayjs from 'dayjs';

export default async function thisWeekOrdersHandler(req, res) {
  await mongooseConnect();

  const startOfWeek = dayjs().startOf('week').toDate();
  const endOfWeek = dayjs().endOf('week').toDate();

  const ordersCount = await Order.countDocuments({
    createdAt: { $gte: startOfWeek, $lt: endOfWeek }
  });

  res.status(200).json({ count: ordersCount });
}
