const Tour = require('./../models/TourModel');
const APIFeatures = require("./../utils/features")
const catchAsync = require("./../utils/catchAsync")
const AppError = require("./../utils/AppError")

exports.setAlias = (req,res,next)=>{

  req.query.limit = "5",
  req.query.sort = "-ratingsAverage,price"
  req.query.fields = "name,price,ratingsAverage,description"
  next()
}


exports.getTours = catchAsync( async(req, res,next) => {
  //to get all tours
  
    let tour = new APIFeatures(Tour.find(),req.query)
    .filter()
    .sort()
    .fields()
    .paginate() 
    
    const tours = await tour.query

    res.status(200).json({
      status: 'ok',
      results:tours.length,
    data:{  
    tours
    }
    
    });
})


exports.postTour = catchAsync( async (req,res,next) => {
  
    reqObj = req.body; //get in req body
    const tours = await Tour.create(reqObj);

    
    res.status(201).json({
      status: 'ok',
      data: {
        tour: tours,
      },
    });
 
});

exports.getToursById = catchAsync(async (req, res,next) => {
     
  
    const tour = await Tour.findById(req.params.id)

    if(!tour)
    {
      return next(new AppError("Not a valid id ",404))
    }

    //const obj = tours[id]
    res.status(200).json({
      status: 'ok',
      data: {
        tour
      },
    });

 })
exports.updateTours = catchAsync(async (req, res,next) => {
  
  
      const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
          new:true,
          runValidators:true
      })

      if(!tour)
    {
      return next(new AppError("Not a valid id ",404))
    }

    res.status(203).json({
        status: 'ok',
        data: {
          tour
        },
      });

  

  })
  
exports.deleteTours = catchAsync(async (req, res,next) => {
  
     const tour = await Tour.findByIdAndDelete(req.params.id)

      if(!tour)
    {
      return next(new AppError("Not a valid id ",404))
    }
      res.status(203).json({
          status: 'ok',
          data: {
            message:"deleted"
          },
        });
  
  
})

//get tour stats aggregation pipeline

exports.getTourStats = catchAsync(async (req, res,next) => {
  
  const stats = await Tour.aggregate(
    [
    {
      $match:{ ratingsAverage: { $gte:4.5} }
    },
    {
      $group:{
        _id:null,
        numTours:{$sum:1},
        numRatings: {$sum: "$ratingsQuantity"},
        avgratings:{$avg : "$ratingsAverage"},
        avgPrice : {$avg : "$price"},
        minPrice : {$min : "$price"},
        maxPrice : {$max : "$price"}
      }

    },
    {
      $sort: {avgPrice : 1}
    }
  ]
  )

  res.status(200).json({
    status: 'ok',
    data: {
      stats
    },
  });

})

//get monthly plans using aggregate pipeline

exports.getMonthlyPlans = catchAsync(async (req, res,next) => {
  const year = req.params.year * 1
  const plans = await Tour.aggregate([
    {
      $unwind: "$startDates"

    },
    {
      $match:{
        startDates:{
          $gte: new Date(`${year}-01-01`),
          $lte:new Date(`${year}-12-31`)
        }
       }
    },
    {
      $group:{
        _id:{$month: "$startDates"},
        numTours: {$sum: 1},
        tours:{$push:"$name"},
      }
    },
    {
      $addFields:{
        month:"$_id"
      }

    },
    {
      $project:{
        _id:0
      }
    },
    {
      $sort:{numTours:-1}
    }
  ])

  res.status(200).json({
    status: 'ok',
    data: {
      plans
    },
  });
})
