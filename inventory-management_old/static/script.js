document.getElementById("inventoryForm").onsubmit = function(e) {
    e.preventDefault();  // Formun varsayılan davranışını durduruyoruz.

    const item_name = document.getElementById("item_name").value;
    const author = document.getElementById("author").value;
    const price = document.getElementById("price").value;
    const image_url = document.getElementById("image_url").value;  // Resim URL'sini de alıyoruz

    // POST isteği gönder
    fetch('/inventory/add-item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item_name: item_name, author: author, price: price, image_url: image_url })  // Resim URL'sini de ekliyoruz
    })
    .then(response => response.json())
    .then(data => {
        alert('Item added: ' + data.message);
        document.getElementById("inventoryForm").reset();  // Formu sıfırla
    })
    .catch(error => console.error('Error:', error));
};
