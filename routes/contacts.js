const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); // Import the Contact model

// GET all contacts
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all contacts...');
    const contacts = await Contact.find().maxTimeMS(30000); // 30 second timeout
    console.log(`Found ${contacts.length} contacts`);
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (err) {
    console.error('Error fetching contacts:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching contacts', 
      error: err.message 
    });
  }
});

// GET a contact by ID
router.get('/:id', async (req, res) => {
  try {
    console.log(`Fetching contact with ID: ${req.params.id}`);
    const contact = await Contact.findById(req.params.id).maxTimeMS(30000);
    if (!contact) {
      return res.status(404).json({ 
        success: false,
        message: 'Contact not found' 
      });
    }
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (err) {
    console.error('Error fetching contact:', err.message);
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID format'
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Error fetching contact', 
      error: err.message 
    });
  }
});

// POST - Create a new contact
router.post('/', async (req, res) => {
  try {
    console.log('Creating new contact:', req.body);
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
    // Basic validation
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: firstName, lastName, email, favoriteColor, birthday'
      });
    }

    const newContact = new Contact({
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday
    });

    const savedContact = await newContact.save();
    console.log('Contact created successfully:', savedContact._id);
    
    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      data: savedContact
    });
  } catch (err) {
    console.error('Error creating contact:', err.message);
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    res.status(400).json({ 
      success: false,
      message: 'Error creating contact', 
      error: err.message 
    });
  }
});

// PUT - Update a contact by ID
router.put('/:id', async (req, res) => {
  try {
    console.log(`Updating contact ${req.params.id}:`, req.body);
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, favoriteColor, birthday },
      { new: true, runValidators: true, maxTimeMS: 30000 }
    );

    if (!updatedContact) {
      return res.status(404).json({ 
        success: false,
        message: 'Contact not found' 
      });
    }

    console.log('Contact updated successfully');
    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      data: updatedContact
    });
  } catch (err) {
    console.error('Error updating contact:', err.message);
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID format'
      });
    }
    res.status(400).json({ 
      success: false,
      message: 'Error updating contact', 
      error: err.message 
    });
  }
});

// DELETE - Delete a contact by ID
router.delete('/:id', async (req, res) => {
  try {
    console.log(`Deleting contact: ${req.params.id}`);
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!deletedContact) {
      return res.status(404).json({ 
        success: false,
        message: 'Contact not found' 
      });
    }

    console.log('Contact deleted successfully');
    res.status(200).json({ 
      success: true,
      message: 'Contact deleted successfully',
      data: deletedContact 
    });
  } catch (err) {
    console.error('Error deleting contact:', err.message);
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID format'
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Error deleting contact', 
      error: err.message 
    });
  }
});

module.exports = router;