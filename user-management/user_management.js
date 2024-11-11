const express = require('express');
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory data store (replace with a database in a real application)
const users = [];
let nextUserId = 1; // Start with 1

// POST endpoint to add a new user
app.post('/add-user', (req, res) => {
  const { username, email } = req.body;

  // Basic validation
  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required.' });
  }

  // Generate a unique user ID
  const userId = nextUserId; // Assign the counter value
  nextUserId++; // Increment the counter
  users.push({ userId, username, email });

  res.json({ message: 'User added successfully!', userId });
});

// GET endpoint to retrieve a specific user
app.get('/users/:userId', (req, res) => {
  const userId = Number(req.params.userId); // Convert to number for comparison
  const user = users.find(user => user.userId === userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' }); // Return 404
  }
});

// GET endpoint to retrieve all users (for example)
app.get('/users', (req, res) => {
  res.json(users);
});

// Run the service on the specified port
const port = 5001;
app.listen(port, () => {
  console.log(`User Management Service listening on port ${port}`);
});
