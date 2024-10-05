import React, { useEffect, useState } from 'react';
import ProductService from '../../service/ProductService';
import BrandService from '../../service/BrandService';
import ProductCategoriesService from '../../service/ProductCategoriesService';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productId, setProductId] = useState(null);
  const [productDetails, setProductDetails] = useState({
    productName: '',
    productQuantity: '',
    image: '',
    brand: { brand_id: null },
    category: { id: null },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetchProducts();
      await fetchBrands();
      await fetchCategories();
    };
    fetchData();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductService.getAllProducts();
      console.log('Products fetched:', response.data);
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await BrandService.getAllBrands();
      console.log('Brands fetched:', response.data);
      setBrands(response.data);
    } catch (err) {
      console.error('Error fetching brands:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await ProductCategoriesService.getAllProductCategories();
      console.log('Categories fetched:', response.data);
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleCreateOrUpdate = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const detailsToSend = {
        ...productDetails,
        brand: { brand_id: productDetails.brand.brand_id },
        category: { id: productDetails.category.id },
      };

      if (productId) {
        await ProductService.updateProduct(productId, detailsToSend);
      } else {
        await ProductService.createProduct(detailsToSend);
      }
      fetchProducts();
      resetForm();
      setFormErrors({}); // Reset form errors after successful submission
    } catch (err) {
      setError('Failed to save product: ' + (err.response?.data?.message || err.message));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!productDetails.productName) {
      errors.productName = 'Product Name is required.';
    }
    if (!productDetails.productQuantity) {
      errors.productQuantity = 'Product Quantity is required.';
    }
    return errors;
  };

  const handleEdit = (product) => {
    setProductId(product.productId);
    setProductDetails({
      productName: product.productName,
      productQuantity: product.productQuantity,
      image: product.image,
      brand: { brand_id: product.brand?.brand_id || null },
      category: { id: product.category?.id || null },
    });
  };

  const resetForm = () => {
    setProductId(null);
    setProductDetails({
      productName: '',
      productQuantity: '',
      image: '',
      brand: { brand_id: null },
      category: { id: null },
    });
    setFormErrors({}); // Clear errors on form reset
  };

  const handleDelete = async (id) => {
    try {
      await ProductService.deleteProduct(id);
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product: ' + (err.response?.data?.message || err.message));
    }
  };

  const getBrandName = (brandId) => {
    const brand = brands.find((b) => b.brand_id === brandId);
    return brand ? brand.brand_name : 'N/A';
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.categoryName : 'N/A';
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Product Management</h1>
      {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

      <div className="mb-6 grid grid-cols-2 gap-6">
        <div>
          <input
            type="text"
            placeholder="Product Name"
            value={productDetails.productName}
            onChange={(e) => setProductDetails({ ...productDetails, productName: e.target.value })}
            className={`border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${formErrors.productName ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formErrors.productName && <div className="text-red-600 text-sm">{formErrors.productName}</div>}
        </div>

        <div>
          <input
            type="number"
            placeholder="Quantity"
            value={productDetails.productQuantity}
            onChange={(e) => setProductDetails({ ...productDetails, productQuantity: e.target.value })}
            className={`border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${formErrors.productQuantity ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formErrors.productQuantity && <div className="text-red-600 text-sm">{formErrors.productQuantity}</div>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Image URL"
            value={productDetails.image}
            onChange={(e) => setProductDetails({ ...productDetails, image: e.target.value })}
            className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <select
            value={productDetails.brand.brand_id || ''}
            onChange={(e) => setProductDetails({ ...productDetails, brand: { brand_id: e.target.value } })}
            className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand.brand_id} value={brand.brand_id}>
                {brand.brand_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={productDetails.category.id || ''}
            onChange={(e) => setProductDetails({ ...productDetails, category: { id: e.target.value } })}
            className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleCreateOrUpdate}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded px-6 py-3 transition-all"
          >
            {productId ? 'Update Product' : 'Add Product'}
          </button>

          <button
            onClick={resetForm}
            className="bg-gray-500 hover:bg-gray-600 text-white rounded px-6 py-3 transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      <table className="min-w-full border-collapse border border-gray-300 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3 text-left">ID</th>
            <th className="border p-3 text-left">Product Name</th>
            <th className="border p-3 text-left">Quantity</th>
            <th className="border p-3 text-left">Image</th>
            <th className="border p-3 text-left">Brand</th>
            <th className="border p-3 text-left">Category</th>
            <th className="border p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? products.map((product) => (
            <tr key={product.productId} className="hover:bg-gray-50">
              <td className="border p-3">{product.productId}</td>
              <td className="border p-3">{product.productName}</td>
              <td className="border p-3">{product.productQuantity}</td>
              <td className="border p-3">
                <img src={product.image} alt={product.productName} className="h-10 w-10 object-cover rounded" />
              </td>
              <td className="border p-3">{getBrandName(product.brand?.brand_id)}</td>
              <td className="border p-3">{getCategoryName(product.category?.id)}</td>
              <td className="border p-3 space-x-4">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white rounded px-4 py-2 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.productId)}
                  className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2 transition-all"
                >
                  Delete
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="7" className="border p-3 text-center">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
