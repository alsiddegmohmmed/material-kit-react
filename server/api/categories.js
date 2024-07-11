// categoriesapi.js
import { mongooseConnect } from "../lib/mongoose.js";
import Category from "../models/Category.js";


export default async function categoriesHandler(req, res) {
    const { method } = req;
    await mongooseConnect();
  


    if (method === 'GET') {
        res.json(await Category.find().populate('parent'));
    }

    if (method === 'POST') {
        const { name, parent, properties } = req.body; // Adjusted
        const categoryDoc = await Category.create({ name, parent: parent || null, properties }); // Adjusted
        res.json(categoryDoc);
    }

    if (method === 'PUT') {
        const { _id, name, parent, properties } = req.body; // Adjusted
        const categoryDoc = await Category.updateOne({ _id }, { name, parent: parent || null, properties }); // Adjusted
        res.json(categoryDoc);
    }

    if (method === 'DELETE') {
        const { _id } = req.query;
        await Category.deleteOne({ _id });
        res.json({ success: true });
    }
}
