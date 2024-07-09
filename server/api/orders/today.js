// pages/api/orders/today.js

import { mongooseConnect } from "../../lib/mongoose.js";
import Order from "../../models/order.js";
import dayjs from 'dayjs';

export default async function todayOrdersHandler(req, res) {
  await  mongooseConnect();

  const startOfDay = dayjs().startOf('day').toDate();
  const endOfDay = dayjs().endOf('day').toDate();

  const ordersCount = await Order.countDocuments({
    createdAt: { $gte: startOfDay, $lt: endOfDay }
  });

  res.status(200).json({ count: ordersCount });
}
