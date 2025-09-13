const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); // Import the Contact model

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - favoriteColor
 *         - birthday
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the contact
 *         firstName:
 *           type: string
 *           description: The first name of the contact
 *         lastName:
 *           type: string
 *           description: The last name of the contact
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the contact
 *         favoriteColor:
 *           type: string
 *           description: The favorite color of the contact
 *         birthday:
 *           type: string
 *           description: The birthday of the contact
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the contact was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the contact was last updated
 *       example:
 *         _id: 67398b123456789012345678
 *         firstName: John
 *         lastName: Doe
 *         email: john.doe@example.com
 *         favoriteColor: blue
 *         birthday: "1990-01-01"
 *         createdAt: "2023-11-16T10:30:00.000Z"
 *         updatedAt: "2023-11-16T10:30:00.000Z"
 */

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: The contacts managing API
 */

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Returns the list of all contacts
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: The list of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contact'
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     summary: Get a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contact id
 *     responses:
 *       200:
 *         description: The contact by id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - favoriteColor
 *               - birthday
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the contact
 *               lastName:
 *                 type: string
 *                 description: The last name of the contact
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the contact
 *               favoriteColor:
 *                 type: string
 *                 description: The favorite color of the contact
 *               birthday:
 *                 type: string
 *                 description: The birthday of the contact
 *             example:
 *               firstName: John
 *               lastName: Doe
 *               email: john.doe@example.com
 *               favoriteColor: blue
 *               birthday: "1990-01-01"
 *     responses:
 *       201:
 *         description: The contact was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Bad request - missing required fields or email already exists
 */
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

/**
 * @swagger
 * /api/contacts/{id}:
 *   put:
 *     summary: Update a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contact id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               favoriteColor:
 *                 type: string
 *               birthday:
 *                 type: string
 *             example:
 *               firstName: Jane
 *               lastName: Smith
 *               email: jane.smith@example.com
 *               favoriteColor: red
 *               birthday: "1985-05-15"
 *     responses:
 *       200:
 *         description: The contact was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Contact not found
 */
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

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contact id
 *     responses:
 *       200:
 *         description: The contact was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
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