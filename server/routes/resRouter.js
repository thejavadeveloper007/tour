const express = require('express');
const { createRestraunt, getRestrauntList, createItem, getItemList } = require('../controller/restrauntController');

const resRouter = express.Router();

resRouter
    .get('/resList', getRestrauntList)
    .post('/create', createRestraunt)
resRouter
    .post('/createItem', createItem)
    .get('/getItemList', getItemList)
    
module.exports = resRouter;