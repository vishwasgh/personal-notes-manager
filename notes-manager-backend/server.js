const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); 

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors()); 
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Simple route
app.get('/', (req, res) => {
  res.send('API is working!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


const Note = require('./models/Notes');

// CREATE a new note
app.post('/notes', async (req, res) => {
  const { title, content, tags } = req.body;
  try {
    const newNote = new Note({
      title,
      content,
      tags,
    });
    await newNote.save();
    res.status(201).json(newNote);  // Send back the created note
  } catch (err) {
    res.status(400).json({ error: 'Error creating note' });
  }
});

// READ all notes
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);  // Send back all notes
  } catch (err) {
    res.status(500).json({ error: 'Error fetching notes' });
  }
});

// UPDATE a note by ID
app.put('/notes/:id', async (req, res) => {
  const { title, content, tags } = req.body;
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, tags },
      { new: true }  // Return the updated document
    );
    res.json(updatedNote);  // Send back the updated note
  } catch (err) {
    res.status(400).json({ error: 'Error updating note' });
  }
});

// DELETE a note by ID
app.delete('/notes/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(204).send();  // No content response for successful deletion
  } catch (err) {
    res.status(400).json({ error: 'Error deleting note' });
  }
});


