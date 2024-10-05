import axios from 'axios';

const API_URL = 'http://localhost:8080/api/products';

const ProductService = {
  // Fetch all products
  getAllProducts: () => axios.get(API_URL),
  
  // Create a new product
  createProduct: (product) => axios.post(API_URL, product),
  
  // Update an existing product by ID
  updateProduct: (productId, product) => axios.put(`${API_URL}/${productId}`, product),
  
  // Delete a product by ID
  deleteProduct: (productId) => axios.delete(`${API_URL}/${productId}`),

  // Fetch a product by ID
  getProductById: (productId) => axios.get(`${API_URL}/${productId}`), // Add this line
};

export default ProductService;
