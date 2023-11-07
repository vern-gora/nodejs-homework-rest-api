import User from "../models/User.js";

import bcrypt from "bcrypt"

import jwt from "jsonwebtoken"

import gravatar from "gravatar";

import Jimp from "jimp";

import fs from "fs/promises";

import path from "path";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

import {nanoid} from "nanoid"

import {HttpError, sendEmail} from "../helpers/index.js"

const {JWT_SECRET, BASE_URL} = process.env

// const avatarsPath = path.resolve("public", "avatars")

const register = async (req, res, next) => {
    
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if(user) {
        throw HttpError(409, `${email} in use`)
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const verificationToken = nanoid()

    const avatarURL = gravatar.url(email);
    const newUser = await User.create({...req.body, password: hashPassword, avatarURL, verificationToken });

    const verifyEmail = {
        to: email,
        subject: "Verify Email",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click to varify email</a>`,
    }
    await sendEmail(verifyEmail)

    res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription,
    })

}

const verify = async (req, res, next) => {
    const {verificationToken} = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw HttpError(404, "User not found")
    }

    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });

    res.json({
        message: "Verification successful"
    })
}


const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(404, "Email not found")
    }
    if (user.verify) {
        throw HttpError(400, "Verification has already been passed")
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click to verify email</a>`
    }
    await sendEmail(verifyEmail);

    res.json({
        message: "Verification email sent"
    })
}

const login = async (req, res, next) => {

    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "Email or password is wrong")
    }

    if(!user.verify) {
        throw HttpError(401, "Email not verify")
    }

    const passwordCompare = await bcrypt.compare(password, user.password) 
    if(!passwordCompare) {
        throw HttpError(401, "Email or password is wrong")
    }

    const payload = {
        id: user._id
    }

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "23h"})
    await User.findByIdAndUpdate(user._id, {token})

    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
          },
    })
}

const logout = async (req, res) => {

    const {_id} = req.user

    await User.findByIdAndUpdate(_id, {token: ""})

    res.status(204).send();

}

const current = async (req, res) => {

    const {email, subscription} = req.user;

    res.json({
        email,
        subscription
    })

}


const updateAvatar = async (req, res) => {
    const { _id } = req.user;
  
    const { path: tempUpload, originalname } = req.file;
    const fileName = `${_id}_${originalname}`;
    const resultUpload = path.resolve(avatarsDir, fileName);
  
    Jimp.read(tempUpload, (err, img) => {
      if (err) {
        console.error("Avatar processing error:", err);
      } else {
        img.resize(250, 250).write(resultUpload);
      }
    });
  
    await fs.unlink(tempUpload);
  
    const avatarURL = path.join("avatars", fileName);
    await User.findByIdAndUpdate(_id, { avatarURL });
  
    res.status(200).json({ avatarURL });
  };


export default {
    register: ctrlWrapper(register),
    verify: ctrlWrapper(verify),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    current: ctrlWrapper(current),
    updateAvatar: ctrlWrapper(updateAvatar)
  }