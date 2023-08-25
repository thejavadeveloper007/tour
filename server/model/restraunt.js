const mongoose = require('mongoose');

const restrauntSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cloudinaryImageId: {
        type: String,
    },
    locality: {
        type: String,
    },
    areaName: {
        type: String,
    },
    costForTwo: {
        type: String,
    },
    cuisines: [{
        type: String
    }],
    avgRating: {
        type: Number,
    },
    price: {
        type: Number,
        required: true
    },
    totalRatingsCount: {
        type: String,
    },
    deliveryTime: {
        type: Number,
    },
    serviceability: {
        type: String
    },
    isOpen: {
        type: Boolean,
        default: false
    },
    type: String,
    discount: String
});

const Restraunt = mongoose.model('restraunt', restrauntSchema);

const itemSchema = new mongoose.Schema({
    resId: [{
        type: String,
        required: true
    }],
    name: {
        type: String,
        required: true
    },
    cloudinaryImageId: {
        type: String,
    },
    avgRating: {
        type: Number,
    },
    price: {
        type: Number,
        required: true
    },
    totalRatingsCount: {
        type: String,
    },
    deliveryTime: {
        type: Number,
    },
    serviceability: {
        type: String
    },
    discount: String
});

const Item = mongoose.model('item', itemSchema);

module.exports = { Restraunt, Item };