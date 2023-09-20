const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const deleteOne = Model =>catchAsync(async(req, res, next)=>{
    const doc = await Model.findByIdAndDelete(req.params.id);
    if(!doc){
        return  next(new AppError('There is no doc with this Id', 404));
    }
    res.status(200).json({
        status: "success"
    })
});

const updateOne = Model => catchAsync(async(req, res, next) =>{
    console.log('file',req.file);
    const id = req.params.id;
    const reqBody = req.body;
    const doc = await Model.findByIdAndUpdate(id,{$set:reqBody},{new:true});
    if(!doc){
        return next(new AppError(`There is no such doc with id ${id}`, 404));
    }
    res.status(200).json({
        status: "success",
        message: `Document with id ${id} updated successfully.`,
        data: doc
    });
});

const getOne = (Model, popOptions) =>catchAsync(async(req, res, next) =>{
    const id = req.params.id;
    const doc =  await Model.findById(id).populate({path: popOptions.path, select: popOptions.select});
    if(!doc){
        return next(new AppError(`There is no doc with this id ${id}`, 404));
    }
    res.status(200).json({
        status: "success",
        message: `Document with id ${id} fetched successfully`,
        data: doc
    })
});

module.exports = { deleteOne, updateOne, getOne }