import mongoose from "mongoose";

const { Schema, model } = mongoose;

const OrderSchema = new Schema({
  line_items: Object,
  name: String,
  email: String,
  city: String,
  postalCode: String,
  streetAddress: String,
  country: String,
  paid: Boolean,
}, {
  timestamps: true,
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;
