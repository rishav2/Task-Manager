const express = require("express")

router=express.Router()
const tourController = require("./../controller/tourController")
const authController = require("./../controller/authController")
//router.param('id',tourController.checkId)           //middleware only works on rotes with params

router.route("/tourStats").get(tourController.getTourStats)
router.route("/monthlyPlans/:year").get(tourController.getMonthlyPlans)

router
.route("/top_cheap")
.get( tourController.setAlias , tourController.getTours)
router
.route("/")
.get(authController.protect, tourController.getTours)
.post(tourController.postTour)
router
.route("/:id")
.get(tourController.getToursById)
.patch(tourController.updateTours)
.delete(
    authController.protect,
    authController.restrictTo("admin","lead-guide"), 
    tourController.deleteTours
    )

module.exports = router