document.getElementById("inventoryForm").onsubmit = function(e) {
    e.preventDefault();  

    const item_name = document.getElementById("item_name").value;
    const author = document.getElementById("author").value;
    const price = document.getElementById("price").value;
    const image_url = document.getElementById("image_url").value;


    const headers = {
        'Content-Type': 'application/json',
        'is-admin': 'true' // Example: Assuming the user is admin (you need a real check here)
    };

    // POST isteği gönder
    fetch('/inventory/add-item', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ item_name, author, price, image_url })
    })
    .then(response => response.json())
    .then(data => {
        alert('Item added: ' + data.message);
        document.getElementById("inventoryForm").reset();  // Formu sıfırla
    })
    .catch(error => console.error('Error:', error));
};

