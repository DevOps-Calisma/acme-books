document.getElementById("inventoryForm").onsubmit = function(e) {
    e.preventDefault();

    const item_name = document.getElementById("item_name").value;
    const author = document.getElementById("author").value;
    const price = document.getElementById("price").value;
    const image_url = document.getElementById("image_url").value;

    fetch('/inventory/add-item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item_name, author, price, image_url })
    })
    .then(response => response.json())
    .then(data => {
        alert('Item added: ' + data.message);
        document.getElementById("inventoryForm").reset();
    })
    .catch(error => console.error('Error:', error));
};

fetch('/inventory/list-items')
    .then(response => response.json())
    .then(books => {
        const bookList = document.getElementById('book-list');
        books.forEach(book => {
            const bookItem = `
                <div class="col-md-4">
                    <div class="card mb-4">
                        <img src="${book.image_url}" class="card-img-top" alt="Book Image">
                        <div class="card-body">
                            <h5 class="card-title">${book.item_name}</h5>
                            <p class="card-text">Author: ${book.author}</p>
                            <p class="card-text">Price: $${book.price}</p>
                            <button class="btn btn-danger" onclick="deleteBook(${book.id})">Delete</button>
                        </div>
                    </div>
                </div>
            `;
            bookList.innerHTML += bookItem;
        });
    })
    .catch(error => console.error('Error fetching books:', error));

function deleteBook(id) {
    fetch(`/inventory/delete-item/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        location.reload();
    })
    .catch(error => console.error('Error deleting book:', error));
}
