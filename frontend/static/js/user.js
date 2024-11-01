document.getElementById("loginForm").onsubmit = function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch('/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Login successful") {
            alert("Welcome, " + data.user.username);
        } else {
            alert("Login failed: " + data.message);
        }
    })
    .catch(error => console.error('Error logging in:', error));
};
