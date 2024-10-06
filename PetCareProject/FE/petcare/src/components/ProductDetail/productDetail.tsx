import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDetailService from "../../service/ProductDetailService";
import Header from "../header/Header";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const ProductDetail = () => {
    const { id: productId } = useParams(); // 'id' is the productId
    const [productDetail, setProductDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1); // Default quantity
    const [stockAvailable, setStockAvailable] = useState(0); // Available stock

    useEffect(() => {
        const fetchProductDetail = async () => {
            setLoading(true); // Start loading before the fetch
            try {
                const response = await ProductDetailService.getProductDetailsByProductId(productId);
                if (!response) {
                    throw new Error("Không tìm thấy sản phẩm");
                }
                setProductDetail(response);
                setStockAvailable(response.quantity); // Set available stock
            } catch (error) {
                console.error("Lỗi khi lấy thông tin sản phẩm:", error);
                const errorMessage = error.message || "Lỗi khi lấy thông tin sản phẩm. Vui lòng thử lại sau.";
                setError(errorMessage);
                toastr.error(errorMessage);
            } finally {
                setLoading(false); // Stop loading after the fetch
            }
        };

        fetchProductDetail();
    }, [productId]);

    // Loading state
    if (loading) {
        return <div className="text-center py-10 text-lg">Đang tải...</div>;
    }

    // Error state
    if (error) {
        return <div className="text-center py-10 text-lg text-red-600">{error}</div>;
    }

    // Check if productDetail is valid
    if (!productDetail) {
        return <div className="text-center py-10 text-lg text-red-600">Không tìm thấy sản phẩm.</div>;
    }

    // Destructure the necessary fields from productDetail
    const { product, price } = productDetail;

    const handleQuantityChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value)); // Ensure quantity is at least 1
        setQuantity(value);
    };

    const handleAddToCart = () => {
        if (quantity > stockAvailable) {
            toastr.error(`Bạn chỉ có thể thêm tối đa ${stockAvailable} ${product.productName}.`);
            return; // Prevent adding to cart if quantity exceeds stock
        }
        // Logic to add product to cart
        console.log(`Thêm ${quantity} ${product.productName} vào giỏ hàng.`);
        toastr.success(`${quantity} ${product.productName} đã được thêm vào giỏ hàng.`);
    };

    const handleCheckout = () => {
        if (quantity > stockAvailable) {
            toastr.error(`Bạn chỉ có thể thanh toán với tối đa ${stockAvailable} ${product.productName}.`);
            return; // Prevent proceeding to checkout if quantity exceeds stock
        }
        // Logic for proceeding to checkout
        console.log("Tiến hành thanh toán.");
        toastr.info("Tiến hành thanh toán.");
    };

    return (
        <>
            <Header />
            <div className="container mx-auto my-5 p-4 bg-white shadow-lg rounded-lg">
                <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/2 flex justify-center">
                        <img
                            src={product?.imageUrl || 'default_image_url.jpg'}
                            alt={product?.productName || 'Sản phẩm'}
                            className="rounded-lg w-48 h-auto object-cover shadow-lg" // Reduced size
                        />
                    </div>
                    <div className="lg:w-1/2 lg:pl-4 mt-6 lg:mt-0">
                        <h1 className="text-2xl font-bold text-gray-800">{product?.productName || 'Tên sản phẩm'}</h1>
                        <p className="text-red-500 text-xl mt-2">{price}₫</p>
                      

                        {/* Quantity Input */}
                        <div className="mt-4 flex items-center">
                            <label htmlFor="quantity" className="block text-lg font-medium">Số lượng:</label>
                            <input
                                id="quantity"
                                type="number"
                                value={quantity}
                                onChange={handleQuantityChange}
                                className="mt-1 block w-20 border border-gray-300 rounded-md p-2"
                                min="1"
                                max={stockAvailable} // Limit input to max available stock
                            />
                            {quantity > stockAvailable && (
                                <p className="text-red-500 mt-2">Bạn chỉ có thể thêm tối đa {stockAvailable} sản phẩm.</p>
                            )}
                        </div>
                        

                        <p className="mt-3 font-bold text-lg">Mô tả: {product?.description || 'Không có mô tả'}</p>


                        {/* Buttons for adding to cart and checkout */}
                        <div className="mt-4 flex space-x-2">
                            <button
                                onClick={handleAddToCart}
                                className="bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-blue-600 transition duration-300"
                            >
                                Thêm vào giỏ
                            </button>
                            <button
                                onClick={handleCheckout}
                                className="bg-green-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-green-600 transition duration-300"
                            >
                                Thanh toán
                            </button>
                        </div>

                        {/* Additional product details */}
                        {/* <div className="mt-6">
                            <h2 className="text-lg font-semibold">Chi tiết sản phẩm</h2>
                            <ul className="list-disc ml-6 mt-2">
                                <li><strong>Thể loại:</strong> {product?.category?.categoryName || 'N/A'}</li>
                                <li><strong>Thương hiệu:</strong> {product?.brand?.brandName || 'N/A'}</li>
                                <li><strong>Đánh giá:</strong> {product?.rating || 0}</li>
                            </ul>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;
