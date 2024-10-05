import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../header/Header";
import ProductService from "../../service/ProductService";
import ProductDetailService from "../../service/ProductDetailService";
import ProductColorsService from "../../service/ProductColorsService";
import ProductSizesService from "../../service/ProductSizesService";
import toastr from "toastr"; // Nhập Toastr
import "toastr/build/toastr.min.css"; // Nhập CSS của Toastr

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [productDetail, setProductDetail] = useState(null);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantityError, setQuantityError] = useState(null);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductData = async () => {
            if (!id) {
                setError("ID sản phẩm không xác định");
                setLoading(false);
                return;
            }
    
            try {
                const productResponse = await ProductService.getProductById(id);
                console.log("Dữ liệu sản phẩm:", productResponse.data);
                setProduct(productResponse.data);
    
                const productDetailResponse = await ProductDetailService.getProductDetailById(id);
                console.log("Dữ liệu chi tiết sản phẩm:", productDetailResponse);
                setProductDetail(productDetailResponse);
    
                const colorsResponse = await ProductColorsService.getColorsByProductId(id);
                console.log("Dữ liệu màu sắc:", colorsResponse.data);
                setColors(colorsResponse.data);
    
                const sizesResponse = await ProductSizesService.getSizesByProductId(id);
                console.log("Dữ liệu kích thước:", sizesResponse.data);
                setSizes(sizesResponse.data);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin sản phẩm:", error.message);
                setError("Không thể lấy thông tin sản phẩm.");
            } finally {
                setLoading(false);
            }
        };
        console.log("ID sản phẩm:", id);
        
        fetchProductData();
    }, [id]);
    

    // Thiết lập tùy chọn cho Toastr
    useEffect(() => {
        toastr.options = {
            closeButton: true,
            debug: false,
            newestOnTop: false,
            progressBar: true,
            positionClass: "toast-top-right-custom",
            preventDuplicates: false,
            onclick: null,
            showDuration: "300",
            hideDuration: "1000",
            timeOut: "2000",
            extendedTimeOut: "1000",
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut"
        };
    }, []); // Chỉ chạy một lần khi component mount


    if (loading) {
        return <div className="text-center py-10 text-lg">Đang tải...</div>;
    }

    if (!product || !productDetail) {
        return <div className="text-center py-10 text-lg text-red-600">Không tìm thấy sản phẩm!</div>;
    }

    const { productName, image, productId, productQuantity, category, brand } = product;
    const { price } = productDetail;

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);

        if (value > productQuantity) {
            setQuantityError(`Số lượng tối đa có sẵn là ${productQuantity}`);
            setSelectedQuantity(productQuantity);
        } else if (value < 1) {
            setQuantityError("Số lượng không thể nhỏ hơn 1");
            setSelectedQuantity(1);
        } else {
            setQuantityError(null);
            setSelectedQuantity(value);
        }
    };

    // Hàm thêm sản phẩm vào giỏ hàng
    const handleAddToCart = () => {
        const cartItem = {
            productId: product.productId,
            productName: product.productName,
            image: product.image,
            price: productDetail.price,
            quantity: selectedQuantity,
        };

        const currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];
        const existingItemIndex = currentCart.findIndex(item => item.productId === cartItem.productId);

        if (existingItemIndex > -1) {
            currentCart[existingItemIndex].quantity += cartItem.quantity;
        } else {
            currentCart.push(cartItem);
        }

        localStorage.setItem("cartItems", JSON.stringify(currentCart));

        // Hiện thông báo thành công bằng Toastr
        toastr.success("Sản phẩm đã được thêm vào giỏ hàng!", "Thành công");
    };

    return (
        <>
            <Header />
            <div style={{ marginTop: '20px' }}>
                {/* Nội dung khác của component */}
            </div>
            <div className="p-6 mt-4 max-w-7xl mx-auto bg-gray-50 rounded-lg shadow-lg">
                <button
                    onClick={handleGoBack}
                    className="mb-4 text-blue-500 hover:text-blue-700 transition duration-200"
                >
                    &larr; Quay lại sản phẩm
                </button>
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 bg-white shadow-lg rounded-lg p-8">
                    <div className="lg:w-1/3 relative hover:scale-105 transition-transform duration-300 ease-in-out">
                        <img
                            src={image ? image : 'default_image_url.jpg'}
                            alt={productName}
                            className="w-full h-auto object-cover rounded-lg border border-gray-200 shadow-md"
                        />
                    </div>
                    <div className="flex-1 lg:pl-10">
                        <h1 className="text-4xl font-bold mb-4 text-gray-900">{productName}</h1>
                        <p className="text-red-600 text-4xl font-semibold mb-6">{price}₫</p>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-medium">Số lượng</span>
                                <input
                                    type="number"
                                    min="1"
                                    value={selectedQuantity}
                                    onChange={handleQuantityChange}
                                    className="border border-gray-300 rounded-lg w-20 p-2 text-center shadow-sm"
                                />
                            </div>

                            {quantityError && (
                                <p className="text-red-500 text-sm mt-1">{quantityError}</p>
                            )}

                            <button
                                onClick={handleAddToCart}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"
                            >
                                Thêm vào giỏ hàng
                            </button>
                            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300">
                                Thanh toán
                            </button>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Màu sắc và kích thước có sẵn</h2>
                            <div className="space-y-2">
                                <p><strong>Màu sắc:</strong> {colors.length ? colors.map(color => color.colorName).join(', ') : 'N/A'}</p>
                                <p><strong>Kích thước:</strong> {sizes.length ? sizes.map(size => size.sizeName).join(', ') : 'N/A'}</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Chi tiết sản phẩm</h2>
                            <div className="space-y-2">
                                <p><strong>Mã sản phẩm:</strong> {productId}</p>
                                <p><strong>Số lượng có sẵn:</strong> {productQuantity}</p>
                                <p><strong>Danh mục:</strong> {category ? category.categoryName : "N/A"}</p>
                                <p><strong>Thương hiệu:</strong> {brand ? brand.brand_name : "N/A"}</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 text-blue-700 p-6 rounded-lg shadow-md mb-4">
                            <p className="font-semibold">
                                Đăng ký nhận{" "}
                                <span className="text-blue-800">Voucher</span> cho dịch vụ spa miễn phí cho thú cưng của bạn!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
