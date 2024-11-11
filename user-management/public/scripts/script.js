// script.js
const form = document.getElementById('user-form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;

  // Send data to the server using a POST request
  fetch('/add-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email })
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to add user.');
    }
  })
  .then(data => {
    console.log(data); // This will now include the userId
    alert('User added successfully! Your user ID is ' + data.userId); // Display the userId
  })
  .catch(error => {
    console.error(error);
    alert('Error adding user: ' + error.message);
  });
});