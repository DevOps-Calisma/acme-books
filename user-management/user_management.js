const express = require('express');
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory data store (replace with a database in a real application)
const users = [];

// POST endpoint to add a new user
app.post('/add-user', (req, res) => {
  const { username, email } = req.body;

  // Basic validation
  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required.' });
  }

  // Add the user to the array
  users.push({ username, email }); 

  res.json({ message: 'User added successfully!' });
});

// GET endpoint to retrieve all users
app.get('/users', (req, res) => {
  res.json(users);
});

// Run the service on the specified port
const port = 5001;
app.listen(port, () => {
  console.log(`User Management Service listening on port ${port}`);
});