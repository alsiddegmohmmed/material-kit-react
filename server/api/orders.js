import { mongooseConnect } from "../lib/mongoose.js";
import Order from "../models/order.js";

export default async function ordersHandler(req,res) {
  await mongooseConnect();
  res.json(await Order.find().sort({createdAt:-1}));
}






