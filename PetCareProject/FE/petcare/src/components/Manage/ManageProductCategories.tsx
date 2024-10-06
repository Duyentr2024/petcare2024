import React, { useEffect, useState } from 'react';
import ProductCategoriesService from '../../service/ProductCategoriesService';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importing icons

const ProductCategoriesTable = () => {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await ProductCategoriesService.getAllProductCategories();
      setCategories(response.data);
    } catch (err) {
      setError('Không thể lấy danh sách danh mục: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdate = async () => {
    try {
      const categoryData = { categogyName: categoryName };
      if (categoryId) {
        await ProductCategoriesService.updateProductCategory(categoryId, categoryData);
      } else {
        await ProductCategoriesService.createProductCategory(categoryData);
      }
      fetchCategories();
      resetForm();
    } catch (err) {
      setError('Không thể lưu danh mục: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (category) => {
    setCategoryId(category.productCategogyId);
    setCategoryName(category.categogyName);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
      try {
        await ProductCategoriesService.deleteProductCategory(id);
        fetchCategories();
      } catch (err) {
        setError('Không thể xóa danh mục: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const resetForm = () => {
    setCategoryId(null);
    setCategoryName('');
    setError(null);
  };

  if (loading) {
    return <div>Đang tải danh mục...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý Danh mục Sản phẩm</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="mb-4 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Tên Danh mục"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="border rounded p-2 w-1/4 focus:ring-2 focus:ring-blue-400"
        />
        <button onClick={handleAddOrUpdate} className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700 transition">
          {categoryId ? 'Cập nhật Danh mục' : 'Thêm Danh mục'}
        </button>
        <button onClick={resetForm} className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-700 transition">
          Đặt lại
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md a text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-200 p-2">ID</th>
            <th className="border border-gray-200 p-2">Tên Danh mục</th>
            <th className="border border-gray-200 p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category.productCategogyId} className="hover:bg-gray-50">
                <td className="border border-gray-200 p-2">{category.productCategogyId}</td>
                <td className="border border-gray-200 p-2">{category.categogyName || 'Unknown Category'}</td>
                <td className="border border-gray-200 p-2 flex">
                  <button onClick={() => handleEdit(category)} className="bg-yellow-500 text-white rounded px-2 py-1 flex items-center space-x-1 hover:bg-yellow-600 transition">
                    <FaEdit /> <span>Chỉnh sửa</span>
                  </button>
                  <button onClick={() => handleDelete(category.productCategogyId)} className="bg-red-500 text-white rounded px-2 py-1 ml-2 flex items-center space-x-1 hover:bg-red-600 transition">
                    <FaTrash /> <span>Xóa</span>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="border border-gray-200 p-2 text-center">Không có danh mục nào</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductCategoriesTable;
