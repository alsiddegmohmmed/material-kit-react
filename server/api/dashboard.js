// server/api/dashboard.js
import { mongooseConnect } from "../lib/mongoose.js";
import Order from "../models/order.js";
import dayjs from "dayjs";

export default async function dashboardHanderler(req, res) {
    await mongooseConnect();

    const startOfMonth =  dayjs().startOf('month').toDate(); 
    const endOfMonth = dayjs().endOf('month').toDate(); 
    const startOfWeek  = dayjs().startOf('week').toDate(); 
    const endOfWeek = dayjs().endOf('week').toDate(); 
    const startOfDay = dayjs().startOf('day').toDate(); 
    const endOfDay = dayjs().endOf('day').toDate(); 

    try {
        const [ordersMonthCount, ordersWeekCount, ordersDayCount, ordersMonth, ordersWeek, ordersDay] = await Promise.all([
            Order.countDocuments({ createdAt: { $gte: startOfMonth, $lt: endOfMonth }}),
            Order.countDocuments({ createdAt: { $gte: startOfWeek, $lt: endOfWeek}}),
            Order.countDocuments({ createdAt: { $gte: startOfDay, $lt: endOfDay }}),
            Order.find({ createdAt: { $gte: startOfMonth, $lt: endOfMonth }}), 
            Order.find({ createdAt: {$gte: startOfWeek, $lt: endOfWeek}}), 
            Order.find({ createdAt: {$gte: startOfDay, $lt: endOfDay}})
        ]);

        const calculateRevenue = (orders) => {
            return orders.reduce((acc, order) => {
                const orderRevenue = order.line_items.reduce((lineAcc, item) => {
                    return lineAcc + (item.price_data.unit_amount * item.quantity / 100); // unit_amount is in cents
                }, 0); 
                return acc + orderRevenue;
            }, 0);
        };

        const revenueMonth = calculateRevenue(ordersMonth); 
        const revenueWeek = calculateRevenue(ordersWeek);
        const revenueDay = calculateRevenue(ordersDay);

        res.status(200).json({
            orders: {
                month: ordersMonthCount,
                week: ordersWeekCount,
                day: ordersDayCount
            },
            revenue: {
                month: revenueMonth,
                week: revenueWeek,
                day: revenueDay
            }
        });
    } catch (error) {
        console.error('Failed to fetch data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
