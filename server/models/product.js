import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const ProductSchema = new Schema({
    title: {
        type: String, 
        required: true
    }, 
    description: {
        type: String 
    },
    price: {
        type: Number, 
        required: true
    }, 
    images: {
        type: [{type:String}] // Array of strings to store image URLs
    }, 
    category: {
        type: mongoose.Types.ObjectId, 
        ref: 'Category',
        default: null
    },
    properties: { type: Object },
}, {
    timestamps: true, 
});

export const Product = models.Product || model('Product', ProductSchema);
