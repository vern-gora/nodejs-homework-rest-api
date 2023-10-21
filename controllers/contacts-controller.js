import Joi from "joi";

import contactsService from "../../models/index.js";

import {HttpError} from "../../helpers/index.js"

const contactsAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.number().required()
})

const getAll = async (req, res, next) => {
    try {
      const result = await contactsService.listContacts();
      res.json(result);
    }
    catch(error) {
      next(error)
    }
}

const getById = async (req, res, next) => {
    try {
      const {id} = req.params;
      
      const result = await contactsService.getContactById(id);
  
      if(!result) {
        throw HttpError(404, `Contact with ${id} id not found`)
      }
  
      res.json(result);
    } 
    catch (error) {
      next(error)
    }
}

const add = async (req, res, next) => {
    try {
      if(!Object.keys(req.body).length){
        throw HttpError(400, "Missing required name field")
      }
  
      const {error} = contactsAddSchema.validate(res.body);
  
      if(error){
        throw HttpError(400, error.message)
      }
  
      const result = await contactsService.addContact(req.body);
      res.status(201).json(result)
    } 
    catch (error) {
      next(error)
    }
}

const deleteById = async (req, res, next) => {
    try {
      const {id} = req.params;
  
      const result = await contactsService.removeContact(id)
  
      if(!result) {
        throw HttpError(404, `Contact with ${id} id not found`)
      }
  
      res.json({message: "Contact deleted"})
    } 
    catch (error) {
        next(error)
    }
}

const updateById = async (req, res, next) => {
    try {
      if(!Object.keys(req.body).length){
        throw HttpError(400, "Fields empty")
      }
  
      const {error} = contactsAddSchema.validate(res.body);
  
      if(error){
        throw HttpError(400, error.message)
      }
  
      const {id} = req.params;
  
      const result = await contactsService.updateContact(id, req.body);
  
      if(!result) {
        throw HttpError(404, `Contact with ${id} id not found`)
        
      }
      res.status(201).json(result)
    } 
    catch (error) {
      next(error)
    }
}

export default {
    getAll,
    getById,
    add,
    deleteById,
    updateById,
  }