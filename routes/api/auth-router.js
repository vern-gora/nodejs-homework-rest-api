import express from "express";

import authController from "../../controllers/auth-controller.js";

import {authenticate, isEmptyBody, upload} from "../../middlewares/index.js";

import {validateBody} from "../../decorators/index.js";

import {userRegisterSchema, userLoginSchema, userEmailSchema} from "../../models/User.js"

const userRegisterValidate = validateBody(userRegisterSchema)
const userLoginValidate = validateBody(userLoginSchema)
const userEmailValidate = validateBody(userEmailSchema)

const authRouter = express.Router()

authRouter.post("/register", isEmptyBody, userRegisterValidate, authController.register)

authRouter.get("/verify/:verificationToken", authController.verify);

authRouter.post("/verify", isEmptyBody, userEmailValidate, authController.resendVerifyEmail)

authRouter.post("/login", isEmptyBody, userLoginValidate, authController.login)

authRouter.post("/logout", authenticate, authController.logout)

authRouter.get("/current", authenticate, authController.current)

authRouter.patch("/avatars", authenticate, upload.single("avatar"), authController.updateAvatar);

export default authRouter;