const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    category: {
        type: String,
        enum: [
            "Electronics",
            "Fashion",
            "Home & Kitchen",
            "Beauty & Personal Care",
            "Health & Wellness",
            "Sports & Outdoors",
            "Toys & Games",
            "Automotive",
            "Books & Media",
            "Office Supplies",
            "Pet Supplies",
            "Baby Products",
            "Groceries",
            "Gifts & Occasions",
            "Art & Craft"
        ],
    //    required: true
    },
    description: {
        type: String,
        maxlength: 250,
        trim: true
    },
    stockQuantity: {
        type: Number,
        min: 0, 
        required: true
    },
    sku: {
        type: String, 
        required: true,
        unique: true,
        trim: true
    },
    images: {
        type: [String], 
        required: true
    },
    brand: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Product = mongoose.model('product',ProductSchema)
module.exports = Product
