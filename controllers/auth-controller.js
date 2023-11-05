import User from "../models/User.js";

import bcrypt from "bcrypt"

import jwt from "jsonwebtoken"

import gravatar from "gravatar";

import Jimp from "jimp";

import fs from "fs/promises";

import path from "path";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

import {HttpError} from "../helpers/index.js"

const {JWT_SECRET} = process.env

const avatarsPath = path.resolve("public", "avatars")

const register = async (req, res, next) => {
    
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if(user) {
        throw HttpError(409, `${email} in use`)
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const avatarURL = gravatar.url(email);
    const newUser = await User.create({...req.body, password: hashPassword, avatarURL });

    res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription,
    })

}

const login = async (req, res, next) => {

    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "Email or password is wrong")
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
        img.contain(250, 250).write(resultUpload);
      }
    });
  
    await fs.unlink(tempUpload);
  
    const avatarURL = path.join("avatars", fileName);
    await User.findByIdAndUpdate(_id, { avatarURL });
  
    res.status(200).json({ avatarURL });
  };


export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    current: ctrlWrapper(current),
    updateAvatar: ctrlWrapper(updateAvatar)
  }