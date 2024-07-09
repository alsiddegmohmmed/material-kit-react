// server/index.mjs

import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';
import { mongooseConnect } from './lib/mongoose.js'; // Adjusted import path
import Order from './models/order.js'; // Adjusted import path
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Use the CORS middleware
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongooseConnect().then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1); // Exit the process if MongoDB connection fails
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// API endpoint for current month's revenue
app.get('/api/revenue/thisMonth', async (req, res) => {
  try {
    // Calculate start and end of the current month
    const startOfMonth = dayjs().startOf('month').toDate();
    const endOfMonth = dayjs().endOf('month').toDate();

    // Query orders within the current month that are paid
    const orders = await Order.find({
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
      paid: true,
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
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
