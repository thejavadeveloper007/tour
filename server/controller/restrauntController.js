const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Restraunt, Item } = require('../model/restraunt');

const createRestraunt = catchAsync(async(req, res, next) =>{
    const reqBody = req.body;
    const restraunt = await Restraunt.create(reqBody);
    res.status(200).json({
        status: "success",
        data: restraunt
    });
});

const getRestrauntList = catchAsync(async(req, res, next) =>{
        const resList = await Restraunt.find();
        res.status(200).json({
            status: "success",
            results: resList.length,
            data: resList
        });  
});

const createItem = catchAsync(async(req, res, next) =>{
    const reqBody = req.body;
    const item = await Item.create(reqBody);
    res.status(200).json({
        status: "success",
        data: item
    });
});

const getItemList = catchAsync(async(req, res, next) =>{
    const itemList = await Item.find();
    res.status(200).json({
        status: "success",
        results: itemList.length,
        data: itemList
    });  
});

module.exports = { createRestraunt, getRestrauntList, createItem, getItemList }