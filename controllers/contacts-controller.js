import Contact from "../models/Contact.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

import {HttpError} from "../helpers/index.js"

const getAll = async (req, res, next) => {
    
      const result = await Contact.find();
      res.json(result);
  
}

const getById = async (req, res, next) => {
   
      const {id} = req.params;
      
      const result = await Contact.findById(id);
  
      if(!result) {
        throw HttpError(404, `Contact with ${id} id not found`)
      }
  
      res.json(result);
    
}

const add = async (req, res, next) => {
   
      const result = await Contact.create(req.body);
      res.status(201).json(result)
    
}

const deleteById = async (req, res, next) => {
    
      const {id} = req.params;
  
      const result = await Contact.findByIdAndDelete(id)
  
      if(!result) {
        throw HttpError(404, `Contact with ${id} id not found`)
      }
  
      res.json({message: "Contact deleted"})
    
}

const updateById = async (req, res, next) => {
      
      const {id} = req.params;
  
      const result = await Contact.findByIdAndUpdate(id, req.body);
  
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