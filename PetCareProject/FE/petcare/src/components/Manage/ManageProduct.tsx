import React, { useEffect, useState } from 'react';
import ProductService from '../../service/ProductService';
import BrandService from '../../service/BrandService';
import ProductCategoriesService from '../../service/ProductCategoriesService';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productId, setProductId] = useState(null);
  const [productDetails, setProductDetails] = useState({
    productName: '',
    productQuantity: '',
    description: '',
    imageUrl: '',
    brand: { brandId: null },
    category: { productCategogyId: null },
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
        brand: { brandId: productDetails.brand.brandId },
        category: { productCategogyId: productDetails.category.productCategogyId },
      };

      if (productId) {
        await ProductService.updateProduct(productId, detailsToSend);
      } else {
        await ProductService.createProduct(detailsToSend);
      }
      fetchProducts();
      resetForm();
      setFormErrors({});
    } catch (err) {
      setError('Failed to save product: ' + (err.response?.data?.message || err.message));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!productDetails.productName) {
      errors.productName = 'Tên sản phẩm là bắt buộc.';
    }
    if (!productDetails.productQuantity) {
      errors.productQuantity = 'Số lượng sản phẩm là bắt buộc.';
    }
    return errors;
  };

  const handleEdit = (product) => {
    setProductId(product.productId);
    setProductDetails({
      productName: product.productName,
      productQuantity: product.productQuantity,
      description: product.description,
      imageUrl: product.imageUrl,
      brand: { brandId: product.brand?.brandId || null },
      category: { productCategogyId: product.category?.productCategogyId || null },
    });
  };

  const resetForm = () => {
    setProductId(null);
    setProductDetails({
      productName: '',
      productQuantity: '',
      description: '',
      imageUrl: '',
      brand: { brandId: null },
      category: { productCategogyId: null },
    });
    setFormErrors({});
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
    const brand = brands.find((b) => b.brandId === brandId);
    return brand ? brand.brandName : 'N/A';
  };

  const getCategoryName = (productCategogyId) => {
    const category = categories.find((c) => c.productCategogyId === productCategogyId);
    return category ? category.categogyName : 'N/A';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Quản lý sản phẩm</h1>
      {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

      <div className="mb-6 p-6 border rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-semibold mb-4">{productId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <input
              type="text"
              placeholder="Tên sản phẩm"
              value={productDetails.productName}
              onChange={(e) => setProductDetails({ ...productDetails, productName: e.target.value })}
              className={`border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${formErrors.productName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {formErrors.productName && <div className="text-red-600 text-sm">{formErrors.productName}</div>}
          </div>

          <div>
            <input
              type="number"
              placeholder="Số lượng"
              value={productDetails.productQuantity}
              onChange={(e) => setProductDetails({ ...productDetails, productQuantity: e.target.value })}
              className={`border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${formErrors.productQuantity ? 'border-red-500' : 'border-gray-300'}`}
            />
            {formErrors.productQuantity && <div className="text-red-600 text-sm">{formErrors.productQuantity}</div>}
          </div>

          <div>
            <input
              type="text"
              placeholder="Đường dẫn ảnh"
              value={productDetails.imageUrl}
              onChange={(e) => setProductDetails({ ...productDetails, imageUrl: e.target.value })}
              className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Mô tả"
              value={productDetails.description}
              onChange={(e) => setProductDetails({ ...productDetails, description: e.target.value })}
              className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <select
              value={productDetails.brand.brandId || ''}
              onChange={(e) => setProductDetails({ ...productDetails, brand: { brandId: e.target.value } })}
              className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Chọn thương hiệu</option>
              {brands.map((brand) => (
                <option key={brand.brandId} value={brand.brandId}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={productDetails.category.productCategogyId || ''}
              onChange={(e) => setProductDetails({ ...productDetails, category: { productCategogyId: e.target.value } })}
              className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Chọn loại sản phẩm</option>
              {categories.map((category) => (
                <option key={category.productCategogyId} value={category.productCategogyId}>
                  {category.categogyName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCreateOrUpdate}
          className="mt-4 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-200"
        >
          {productId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-300 shadow-md rounded text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Tên sản phẩm</th>
            <th className="border px-4 py-2">Số lượng</th>
            <th className="border px-4 py-2">Thương hiệu</th>
            <th className="border px-4 py-2">Loại sản phẩm</th>
            <th className="border px-4 py-2">Mô tả</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.productId} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{product.productName}</td>
              <td className="border px-4 py-2">{product.productQuantity}</td>
              <td className="border px-4 py-2">{getBrandName(product.brand?.brandId)}</td>
              <td className="border px-4 py-2">{getCategoryName(product.category?.productCategogyId)}</td>
              <td className="border px-4 py-2">{product.description}</td>
              <td className="border px-4 py-2 flex space-x-2">
                <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(product.productId)} className="text-red-600 hover:text-red-800">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
