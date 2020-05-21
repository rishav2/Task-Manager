
const express = require("express")
router=express.Router()
const userController = require("./../controller/userController")
const authController = require("./../controller/authController")

router.post("/signup",authController.signup)
router.get("/login",authController.login)
router.post("/forgotPassword",authController.forgotPassword)
router.patch("/resetPassword/:token",authController.resetPassword)

router
.route("/")
.get(userController.getAllUsers)
.post(userController.createUser)
router
.route("/:id")
.get(userController.getUserById)
.patch(userController.updateUser)
.delete(userController.deleteUser)

module.exports = router