import React, { useEffect, useState } from 'react';
import ProductCategoriesService from '../../service/ProductCategoriesService';

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
      setError('Failed to fetch categories: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdate = async () => {
    try {
      const categoryData = { categoryName };
      if (categoryId) {
        await ProductCategoriesService.updateProductCategory(categoryId, categoryData);
      } else {
        await ProductCategoriesService.createProductCategory(categoryData);
      }
      fetchCategories();
      resetForm();
    } catch (err) {
      setError('Failed to save category: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (category) => {
    setCategoryId(category.id);
    setCategoryName(category.categoryName);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await ProductCategoriesService.deleteProductCategory(id);
        fetchCategories();
      } catch (err) {
        setError('Failed to delete category: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const resetForm = () => {
    setCategoryId(null);
    setCategoryName('');
    setError(null);
  };

  if (loading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Categories Management</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="border rounded p-2 w-1/4"
        />
        <button onClick={handleAddOrUpdate} className="bg-blue-500 text-white rounded px-4 py-2 ml-2">
          {categoryId ? 'Update Category' : 'Add Category'}
        </button>
        <button onClick={resetForm} className="bg-gray-500 text-white rounded px-4 py-2 ml-2">
          Reset
        </button>
      </div>

      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-200 p-2">ID</th>
            <th className="border border-gray-200 p-2">Category Name</th>
            <th className="border border-gray-200 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category.id}>
                <td className="border border-gray-200 p-2">{category.id}</td>
                <td className="border border-gray-200 p-2">{category.categoryName}</td>
                <td className="border border-gray-200 p-2">
                  <button onClick={() => handleEdit(category)} className="bg-yellow-500 text-white rounded px-2 py-1">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(category.id)} className="bg-red-500 text-white rounded px-2 py-1 ml-2">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="border border-gray-200 p-2 text-center">No categories available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductCategoriesTable;
