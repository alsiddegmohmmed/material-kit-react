import mongoose from "mongoose";

const { Schema, models, model } = mongoose;


const CategorySchema = new Schema({
    name: {
    type:String,
    required: true
    },
    parent: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',

    }, 
    properties: [{type:Object}]
    
});

const Category = models?.Category || mongoose.model('Category', CategorySchema);



export default Category;