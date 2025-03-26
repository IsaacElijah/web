// Load XML using Fetch API
function loadBooks() {
    fetch("books.xml") // Fetch the books.xml file from the folder
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to load books.xml");
            }
            return response.text(); // Parse the response as text
        })
        .then((data) => {
            const parser = new DOMParser(); // Create a DOMParser to parse the XML
            const xml = parser.parseFromString(data, "application/xml"); // Parse the XML text
            displayBooks(xml); // Pass the parsed XML document to displayBooks
        })
        .catch((error) => {
            console.error("Error loading books.xml:", error); // Log any errors
        });
}

// Display books in the HTML
function displayBooks(xml) {
    let bookList = document.getElementById("bookList"); // Get the book list container
    let books = xml.getElementsByTagName("book"); // Get all <book> elements from the XML
    bookList.innerHTML = ""; // Clear the book list container

    // Loop through each book and create its HTML representation
    for (let i = 0; i < books.length; i++) {
        let title = books[i].getElementsByTagName("title")[0].textContent; // Get the book title
        let author = books[i].getElementsByTagName("author")[0].textContent; // Get the author
        let price = books[i].getElementsByTagName("price")[0].textContent; // Get the price
        let bookId = books[i].getAttribute("id"); // Get the book's unique ID

        // Create a new div for the book item
        let bookItem = document.createElement("div");
        bookItem.classList.add("book-item"); // Add the "book-item" class for styling

        // Set the inner HTML of the book item
        bookItem.innerHTML = `
            <strong>${title}</strong> by ${author} - $${price}
            <button onclick="addToCart('${bookId}', '${title}', '${price}')">Add to Cart</button>
        `;

        // Append the book item to the book list container
        bookList.appendChild(bookItem);
    }
}

// Call loadBooks on page load
window.onload = function () {
    loadBooks(); // Load the books from the XML file
    displayCart(); // Display the cart
};

// Search function to filter books
function filterBooks() {
    let searchQuery = document.getElementById("searchInput").value.toLowerCase(); // Get the search query
    let bookItems = document.getElementsByClassName("book-item"); // Get all book items

    // Loop through each book item and filter based on the search query
    for (let book of bookItems) {
        let text = book.textContent.toLowerCase(); // Get the text content of the book item
        book.style.display = text.includes(searchQuery) ? "block" : "none"; // Show or hide the book
    }
}

// Shopping Cart Logic
let cart = JSON.parse(localStorage.getItem("cart")) || []; // Load the cart from localStorage or initialize an empty array

// Add a book to the cart
function addToCart(id, title, price) {
    cart.push({ id, title, price }); // Add the book to the cart array
    localStorage.setItem("cart", JSON.stringify(cart)); // Save the updated cart to localStorage
    displayCart(); // Update the cart display
}

// Display the shopping cart
function displayCart() {
    let cartList = document.getElementById("cartList"); // Get the cart list container
    cartList.innerHTML = ""; // Clear the cart list

    let totalPrice = 0; // Initialize total price

    // Loop through each item in the cart and create its HTML representation
    cart.forEach((item, index) => {
        let li = document.createElement("li");
        li.innerHTML = `
            ${item.title} - $${item.price} 
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartList.appendChild(li); // Append the item to the cart list

        totalPrice += parseFloat(item.price); // Add the item's price to the total
    });

    // Display the total price
    let totalPriceElement = document.createElement("div");
    totalPriceElement.id = "totalPrice";
    totalPriceElement.style.marginTop = "20px";
    totalPriceElement.style.fontWeight = "bold";
    totalPriceElement.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
    cartList.appendChild(totalPriceElement); // Append the total price to the cart list
}

// Remove a book from the cart
function removeFromCart(index) {
    cart.splice(index, 1); // Remove the item from the cart array
    localStorage.setItem("cart", JSON.stringify(cart)); // Save the updated cart to localStorage
    displayCart(); // Update the cart display
}

// Load books and cart on page load
window.onload = function () {
    loadBooks(); // Load the books from the XML file
    displayCart(); // Display the cart
};