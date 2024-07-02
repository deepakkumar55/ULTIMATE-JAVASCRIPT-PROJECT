const products = [
    { id: 1, name: 'Product 1', price: 19.99, category: 'Category A', image: 'product1.jpg' },
    { id: 2, name: 'Product 2', price: 29.99, category: 'Category B', image: 'product2.jpg' },
    { id: 3, name: 'Product 3', price: 39.99, category: 'Category A', image: 'product3.jpg' },
    { id: 4, name: 'Product 4', price: 49.99, category: 'Category C', image: 'product4.jpg' },
    { id: 5, name: 'Product 5', price: 59.99, category: 'Category B', image: 'product5.jpg' }
];

const productList = document.getElementById('productList');
const searchInput = document.getElementById('searchInput');

// Function to display products based on search input
function displayProducts(products) {
    productList.innerHTML = ''; // Clear previous product list

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <img src="images/${product.image}" alt="${product.name}" class="product-image">
            <div class="product-details">
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
                <p>Category: ${product.category}</p>
            </div>
        `;
        productList.appendChild(productElement);
    });
}

// Initial display of all products
displayProducts(products);

// Event listener for search input
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
});
