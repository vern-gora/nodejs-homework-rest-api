import Contact from "../models/Contact.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

import {HttpError} from "../helpers/index.js"

const getAll = async (req, res, next) => {

      const { _id: owner } = req.user;
      const {page = 1, limit = 10} = req.query;
      const skip = (page - 1) * limit;
    
      const result = await Contact.find({owner}, "", {skip, limit}).populate('owner', "email subscription");
      res.json(result);
  
}


const getById = async (req, res, next) => {

      const { _id: owner } = req.user;
   
      const {id} = req.params;
      
      // const result = await Contact.findById(id);
      const result = await Contact.findOne({_id: id, owner});

  
      if(!result) {
        throw HttpError(404, `Contact with ${id} id not found`)
      }
  
      res.json(result);
    
}


const add = async (req, res, next) => {

      const { _id: owner } = req.user;
   
      const result = await Contact.create({...req.body, owner});
      res.status(201).json(result)
    
}


const deleteById = async (req, res, next) => {

      const { _id: owner } = req.user;
    
      const {id} = req.params;
  
      // const result = await Contact.findByIdAndDelete(id)
      const result = await Contact.findOneAndDelete({_id: id})

  
      if(!result) {
        throw HttpError(404, `Contact with ${id} id not found`)
      }
  
      res.json({message: "Contact deleted"})
    
}


const updateById = async (req, res, next) => {
      
      const {id} = req.params;
  
      // const result = await Contact.findByIdAndUpdate(id, req.body);
      const result = await Contact.findOneAndUpdate({_id: id, owner}, req.body)
  
      if(!result) {
        throw HttpError(404, `Contact with ${id} id not found`)
        
      }
      res.status(201).json(result)
    
}


export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    deleteById: ctrlWrapper(deleteById),
    updateById: ctrlWrapper(updateById),
  }