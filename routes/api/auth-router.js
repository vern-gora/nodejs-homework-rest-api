import express from "express";

import authController from "../../controllers/auth-controller.js";

import {authenticate, isEmptyBody} from "../../middlewares/index.js";

import {validateBody} from "../../decorators/index.js";

import {userRegisterSchema, userLoginSchema} from "../../models/User.js"

const userRegisterValidate = validateBody(userRegisterSchema)
const userLoginValidate = validateBody(userLoginSchema)

const authRouter = express.Router()

authRouter.post("/register", isEmptyBody, userRegisterValidate, authController.register)

authRouter.post("/login", isEmptyBody, userLoginValidate, authController.login)

authRouter.post("/logout", authenticate, authController.logout)

authRouter.get("/current", authenticate, authController.current)


export default authRouter;