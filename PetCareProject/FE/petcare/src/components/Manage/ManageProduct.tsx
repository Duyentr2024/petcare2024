import React, { useState, useEffect } from "react";
import ProductService from "../../service/ProductService";

export default function ProductTable() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await ProductService.getAllProducts();
                console.log('Products fetched:', response.data); // Log the response data
                setProducts(response.data);
            } catch (err) {
                setError('Failed to fetch products: ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleEdit = (product) => {
        // Implement edit functionality
        console.log("Edit product:", product);
    };

    const handleDelete = (productId) => {
        // Implement delete functionality
        console.log("Delete product with ID:", productId);
    };

    const getBrandName = (brandId) => {
        // Logic to get brand name by brandId
        // You might want to maintain a mapping of brandId to brandName
        return "Brand Name"; // Placeholder
    };

    const getCategoryName = (categoryId) => {
        // Logic to get category name by categoryId
        // You might want to maintain a mapping of categoryId to categoryName
        return "Category Name"; // Placeholder
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <table className="min-w-full border-collapse border border-gray-400">
            <thead>
                <tr>
                    <th className="border p-3">ID</th>
                    <th className="border p-3">Tên Sản Phẩm</th>
                    <th className="border p-3">Số Lượng</th>
                    <th className="border p-3">Hình Ảnh</th>
                    <th className="border p-3">Mô Tả</th>
                    <th className="border p-3">Thương Hiệu</th>
                    <th className="border p-3">Danh Mục</th>
                    <th className="border p-3">Hành Động</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => {
                    console.log(product); // Log each product object for debugging
                    return (
                        <tr key={product.productId}>
                            <td className="border p-3">{product.productId}</td>
                            <td className="border p-3">{product.productName}</td>
                            <td className="border p-3">{product.productQuantity}</td>
                            <td className="border p-3">
                                <img src={product.imageUrl} alt={product.productName} className="w-20 h-20 object-cover" />
                            </td>
                            <td className="border p-3">{product.description}</td>
                            <td className="border p-3">{getBrandName(product.brand?.brandId)}</td>
                            <td className="border p-3">{getCategoryName(product.category?.productCategogyId)}</td>
                            <td className="border p-3">
                                <button onClick={() => handleEdit(product)} className="bg-yellow-500 hover:bg-yellow-600 text-white rounded px-4 py-2 mr-2">
                                    Chỉnh sửa
                                </button>
                                <button onClick={() => handleDelete(product.productId)} className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2">
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
