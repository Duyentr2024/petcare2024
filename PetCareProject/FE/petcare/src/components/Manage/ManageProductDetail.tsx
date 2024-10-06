import React, { useState, useEffect } from "react";
import ProductDetailService from "../../service/ProductDetailService";
import ProductService from "../../service/ProductService";
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons

const ProductDetailManager = () => {
  const [productDetails, setProductDetails] = useState([]);
  const [product, setProduct] = useState([]);
  const [formData, setFormData] = useState({ productId: "", quantity: 0, price: 0 });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadProductDetails();
    loadProduct();
  }, []);

  const loadProductDetails = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await ProductDetailService.getAllProductDetails();
      console.log("Fetched Product Details:", response);
      setProductDetails(response);
    } catch (error) {
      console.error("Error loading product details", error);
      setErrorMessage("Không thể tải thông tin chi tiết sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const loadProduct = async () => {
    setErrorMessage("");
    try {
      const response = await ProductService.getAllProducts();
      console.log("Fetched Products:", response);
      setProduct(response.data);
    } catch (error) {
      console.error("Error loading products", error);
      setErrorMessage("Không thể tải danh sách sản phẩm.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      if (editMode) {
        await ProductDetailService.updateProductDetail(editId, {
          product: { productId: formData.productId },
          quantity: formData.quantity,
          price: formData.price,
        });
        setEditMode(false);
      } else {
        await ProductDetailService.createProductDetail({
          product: { productId: formData.productId },
          quantity: formData.quantity,
          price: formData.price,
        });
      }
      setFormData({ productId: "", quantity: 0, price: 0 });
      loadProductDetails();
    } catch (error) {
      console.error("Error saving product detail", error);
      setErrorMessage("Có lỗi khi lưu thông tin chi tiết sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thông tin chi tiết sản phẩm này không?")) {
      try {
        await ProductDetailService.deleteProductDetail(id);
        loadProductDetails();
      } catch (error) {
        console.error("Error deleting product detail", error);
        setErrorMessage("Có lỗi khi xóa thông tin chi tiết sản phẩm.");
      }
    }
  };

  const handleEdit = (detail) => {
    setFormData({
      productId: detail.product.productId || "",
      quantity: detail.quantity || 0,
      price: detail.price || 0,
    });
    setEditId(detail.productDetailId);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setFormData({ productId: "", quantity: 0, price: 0 });
    setEditMode(false);
    setEditId(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Detail Manager</h1>
      
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="mb-6 space-y-4 p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50">
        <div>
          <label className="block text-sm font-medium">Product</label>
          <select
            name="productId"
            value={formData.productId}
            onChange={handleInputChange}
            className="block w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a product</option>
            {product.map((prod) => (
              <option key={prod.productId} value={prod.productId}>
                {prod.productName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            className="block w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="block w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-x-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
            disabled={loading}
          >
            {loading ? (editMode ? "Updating..." : "Saving...") : editMode ? "Update Product Detail" : "Save Product Detail"}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 border-b text-left">Product</th>
            <th className="py-2 px-4 border-b text-left">Quantity</th>
            <th className="py-2 px-4 border-b text-left">Price</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {productDetails.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4">No product details found.</td>
            </tr>
          ) : (
            productDetails.map((detail) => {
              const prod = product.find(p => p.productId === detail.product?.productId);
              return (
                <tr key={detail.productDetailId} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{prod ? prod.productName : "Unknown Product"}</td>
                  <td className="py-2 px-4 border-b">{detail.quantity}</td>
                  <td className="py-2 px-4 border-b">{detail.price}</td>
                  <td className="py-2 px-4 border-b flex space-x-2">
                    <button
                      onClick={() => handleEdit(detail)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-700 flex items-center space-x-1"
                    >
                      <FaEdit /> <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(detail.productDetailId)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 flex items-center space-x-1"
                    >
                      <FaTrash /> <span>Delete</span>
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductDetailManager;
