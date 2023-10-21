import fs from 'fs/promises'
import path from 'path'
import { nanoid } from 'nanoid'

const contactsPath = path.resolve('models', 'contacts.json')

const listContacts = async () => {
    const contacts = await fs.readFile(contactsPath);
    return JSON.parse(contacts);
}

const getContactById = async (id) => {
    const contacts = await listContacts();
    const result  = contacts.find(contact => contact.id === id);
    return result || null;
}

const removeContact = async (id) => {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === id);
    if (index === -1) {
        return null
    }
    const [result] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return result;
}

const addContact = async ({name, email, phone}) => {
    const contacts = await listContacts();
    const newContact = {
        id: nanoid(),
        name,
        email,
        phone
    }
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact
}

const updateContact = async (id, {name, email, phone}) => {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === id);
    if(index === -1){
        return null;
    }
    contacts[index] = {id, name, email, phone};
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[index]
}

// const fs = require('fs/promises')

// const listContacts = async () => {}

// const getContactById = async (contactId) => {}

// const removeContact = async (contactId) => {}

// const addContact = async (body) => {}

// const updateContact = async (contactId, body) => {}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
