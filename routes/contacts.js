const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); // Import the Contact model

// GET all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ 
      message: 'Error fetching contacts', 
      error: err.message 
    });
  }
});

// GET a contact by ID
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json({ 
      message: 'Error fetching contact', 
      error: err.message 
    });
  }
});

// POST - Create a new contact
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday
    });

    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (err) {
    res.status(400).json({ 
      message: 'Error creating contact', 
      error: err.message 
    });
  }
});

// PUT - Update a contact by ID
router.put('/:id', async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, favoriteColor, birthday },
      { new: true, runValidators: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json(updatedContact);
  } catch (err) {
    res.status(400).json({ 
      message: 'Error updating contact', 
      error: err.message 
    });
  }
});

// DELETE - Delete a contact by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ 
      message: 'Contact deleted successfully',
      deletedContact 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error deleting contact', 
      error: err.message 
    });
  }
});

module.exports = router;