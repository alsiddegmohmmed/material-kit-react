// server/index.mjs

import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';
import { mongooseConnect } from './lib/mongoose.js'; // Adjusted import path
import Order from './models/order.js'; // Adjusted import path
import dotenv from 'dotenv';
import thisMonthRevenueHandler from './api/revenue/thisMonth.js';
import thisWeekRevenueHandler from './api/revenue/thisWeek.js';
import todayRevenueHandler from './api/revenue/today.js';
import thisMonthOrdersHandler from './api/orders/thisMonth.js';
import thisWeekOrdersHandler from './api/orders/thisWeek.js';
import todayOrdersHandler from './api/orders/today.js';
import ordersHandler from './api/orders.js';
import productsHandler from './api/products.js';
import categoriesHandler from './api/categories.js';

dotenv.config();

console.log("Loaded environment variables:");
console.log(process.env); // Log all environment variables
console.log("MONGODB_URI:", process.env.MONGODB_URI); // Log the specific variable

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
app.get('/api/revenue/thisMonth', thisMonthRevenueHandler); // Use the handler function
app.get('/api/revenue/thisWeek', thisWeekRevenueHandler); // Use the handler function
app.get('/api/revenue/today', todayRevenueHandler); // Use the handler function
app.get('/api/orders/thisMonth', thisMonthOrdersHandler); // Use the handler function
app.get('/api/orders/thisWeek', thisWeekOrdersHandler); // Use the handler function
app.get('/api/orders/today', todayOrdersHandler); // Use the handler function

app.get('/api/orders', ordersHandler); // Use the handler function

app.all('/api/products', productsHandler); // Use the handler function

app.get('/api/categories', categoriesHandler); // Use the handler function

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
