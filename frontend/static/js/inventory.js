// inventory_form.html sayfasındaki formu gönderme işlemi
const inventoryForm = document.getElementById("inventoryForm");
if (inventoryForm) {
    inventoryForm.onsubmit = function(e) {
        e.preventDefault();

        const item_name = document.getElementById("item_name").value;
        const author = document.getElementById("author").value;
        const price = document.getElementById("price").value;
        const image_url = document.getElementById("image_url").value;
        const stock = document.getElementById("stock") ? document.getElementById("stock").value : 1;

        fetch('/inventory/add-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ item_name, author, price, image_url, stock })
        })
        .then(response => response.json())
        .then(data => {
            alert('Item added: ' + data.message);
            document.getElementById("inventoryForm").reset();
        })
        .catch(error => console.error('Error:', error));
    };
}

// inventory_list.html sayfasındaki listeleme işlemi
const bookListContainer = document.getElementById('book-list');
if (bookListContainer) {
    fetch('/inventory/list-items')
        .then(response => response.json())
        .then(books => {
            if (!books || books.length === 0) {
                bookListContainer.innerHTML = '<p class="text-center">No books available.</p>';
                return;
            }

            books.forEach(book => {
                const bookItem = `
                    <div class="col-md-4">
                        <div class="card mb-4">
                            <img src="${book.image_url}" class="card-img-top" alt="Book Image">
                            <div class="card-body">
                                <h5 class="card-title">${book.item_name}</h5>
                                <p class="card-text">Author: ${book.author}</p>
                                <p class="card-text">Price: $${book.price}</p>
                                <p class="card-text">Stock: ${book.stock}</p>
                                <button class="btn btn-danger" onclick="deleteBook(${book.id})">Delete</button>
                            </div>
                        </div>
                    </div>
                `;
                bookListContainer.innerHTML += bookItem;
            });
        })
        .catch(error => console.error('Error fetching books:', error));
}

// Silme fonksiyonu
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
