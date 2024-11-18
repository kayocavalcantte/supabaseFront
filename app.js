const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductForm = document.querySelector('#update-product-form');
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductPrice = document.querySelector('#update-price');
const updateProductDescription = document.querySelector('#update-description');

// Modal elements
const modal = document.getElementById('update-modal');
const closeModalButton = document.getElementById('close-modal');

// Function to fetch all products from the server
async function fetchProducts() {
  const response = await fetch('http://34.228.213.194:3000/products');
  const products = await response.json();

  // Clear product list
  productList.innerHTML = '';

  // Add each product to the list
  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `${product.name} - $${product.price} - ${product.description}`;

    // Add delete button for each product
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Apagar';
    deleteButton.addEventListener('click', async () => {
      await deleteProduct(product.id);
      await fetchProducts();
    });
    li.appendChild(deleteButton);

    // Add update button for each product
    const updateButton = document.createElement('button');
    updateButton.innerHTML = 'Atualizar';
    updateButton.addEventListener('click', () => openModal(product));
    li.appendChild(updateButton);

    productList.appendChild(li);
  });
}

// Show modal and populate fields
function openModal(product) {
  updateProductId.value = product.id;
  updateProductName.value = product.name;
  updateProductPrice.value = product.price;
  updateProductDescription.value = product.description;

  modal.style.display = 'block';
}

// Hide modal
closeModalButton.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close modal when clicking outside content
window.addEventListener('click', event => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

// Event listener for Add Product form submit button
addProductForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const newProduct = {
    name: addProductForm.name.value,
    description: addProductForm.description.value,
    price: addProductForm.price.value,
  };

  await fetch('http://34.228.213.194:3000/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProduct),
  });

  addProductForm.reset();
  await fetchProducts();
});

// Update product
updateProductForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const updatedProduct = {
    id: updateProductId.value,
    name: updateProductName.value,
    description: updateProductDescription.value,
    price: updateProductPrice.value,
  };

  await fetch(`http://34.228.213.194:3000/products/${updatedProduct.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedProduct),
  });

  modal.style.display = 'none';
  await fetchProducts();
});

// Delete product by ID
async function deleteProduct(id) {
  await fetch(`http://34.228.213.194:3000/products/${id}`, { method: 'DELETE' });
}

// Initial fetch of products
fetchProducts();
