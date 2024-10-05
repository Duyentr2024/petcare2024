import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/Header";

interface Product {
  productId: number;
  image: string;
  productName: string;
  price: number;
  quantity: number;
}

const Cart: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const cartData = localStorage.getItem("cartItems");
      if (cartData) {
        setProducts(JSON.parse(cartData));
      } else {
        setProducts([]);
      }
    } catch (error) {
      setError("Đã xảy ra lỗi khi tải giỏ hàng.");
    }
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedProducts = products.map((product) =>
      product.productId === id ? { ...product, quantity: newQuantity } : product
    );
    setProducts(updatedProducts);
    localStorage.setItem("cartItems", JSON.stringify(updatedProducts));
  };

  const handleRemoveItem = (id: number) => {
    const updatedProducts = products.filter(
      (product) => product.productId !== id
    );
    setProducts(updatedProducts);
    localStorage.setItem("cartItems", JSON.stringify(updatedProducts));
  };

  const calculateTotal = () => {
    return products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleCheckout = async () => {
    if (products.length === 0) {
      setError("Giỏ hàng của bạn trống. Vui lòng thêm sản phẩm trước khi thanh toán.");
      return;
    }
  
    // Điều hướng tới trang thanh toán với dữ liệu giỏ hàng
    navigate("/checkout", { state: { products, total: calculateTotal() } });
  };

  return (
    <>
      <Header />
      <div className="p-6 mt-4 max-w-7xl mx-auto bg-gray-50 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6">Giỏ hàng của bạn</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {products.length === 0 ? (
          <div className="text-center">
            <img
              src="https://bizweb.dktcdn.net/100/373/627/themes/936292/assets/empty-cart.png?1719564212117"
              alt="Giỏ hàng trống"
              className="w-auto h-auto mx-auto mb-4"
            />
            <p className="text-gray-500">
              Không có sản phẩm nào trong giỏ hàng.{" "}
              <a
                href="/"
                className="text-blue-500 font-bold underline hover:text-blue-700"
              >
                Quay lại cửa hàng để tiếp tục mua sắm.
              </a>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <table className="min-w-full table-auto border-collapse border-2 border-[#F2BC27]">
              <thead>
                <tr className="border-b-2 border-[#F2BC27]">
                  <th className="px-6 py-4 text-left">Xóa</th>
                  <th className="px-6 py-4 text-left">Sản phẩm</th>
                  <th className="px-6 py-4 text-left">Giá</th>
                  <th className="px-6 py-4 text-left">Số lượng</th>
                  <th className="px-6 py-4 text-left">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const totalPrice = product.price * product.quantity;
                  return (
                    <tr
                      key={product.productId}
                      id={`product-row-${product.productId}`}
                      className="border-b transition-opacity duration-300"
                    >
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleRemoveItem(product.productId)}
                          className="text-red-500 text-xl hover:text-red-700 transition duration-300 bg-white p-1 rounded-full"
                        >
                          &times;
                        </button>
                      </td>
                      <td className="px-6 py-4 flex items-center">
                        <img
                          src={product.image}
                          alt={product.productName}
                          className="w-16 h-16 object-cover rounded-lg mr-4"
                        />
                        {product.productName}
                      </td>
                      <td className="px-6 py-4">{formatPrice(product.price)}</td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min="1"
                          value={product.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              product.productId,
                              parseInt(e.target.value)
                            )
                          }
                          className="border border-gray-300 rounded-lg w-16 p-2 text-center"
                        />
                      </td>
                      <td className="px-6 py-4">{formatPrice(totalPrice)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="mt-6 text-right">
              <h2 className="text-xl font-bold">
                Tổng cộng: {formatPrice(calculateTotal())}
              </h2>
              <button
                onClick={handleCheckout}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300 mt-4"
              >
                Thanh toán
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
