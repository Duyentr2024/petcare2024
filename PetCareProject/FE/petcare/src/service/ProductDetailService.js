// ProductDetailService.js

const BASE_URL = "http://localhost:8080/api/product-details";

const ProductDetailService = {
  
  // Fetch all ProductDetails
  getAllProductDetails: async () => {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Fetch ProductDetail by ID
  getProductDetailById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`); // Gọi API với ID
      if (!response.ok) {
        throw new Error(`Failed to fetch product detail with ID ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Create or update ProductDetail
  saveProductDetail: async (productDetail) => {
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productDetail),
      });
      if (!response.ok) {
        throw new Error("Failed to save product detail");
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Delete ProductDetail by ID
  deleteProductDetail: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete product detail with ID ${id}`);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Fetch ProductDetails by CartDetails ID
  getProductDetailsByCartDetailsId: async (cartDetailsId) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/${cartDetailsId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch product details for cart ID ${cartDetailsId}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Fetch ProductDetails by Product ID
  getProductDetailsByProductId: async (productId) => {
    try {
      const response = await fetch(`${BASE_URL}/product/${productId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch product details for product ID ${productId}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default ProductDetailService;
