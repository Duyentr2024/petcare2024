import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Product {
  productId: number;
  image: string;
  productName: string;
  price: number;
  quantity: number;
}

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const products: Product[] = location.state?.products || [];

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

  const handlePayment = async () => {
    if (products.length === 0) {
      alert("Giỏ hàng trống, không thể thanh toán.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: products.map(product => ({
            productId: product.productId,
            quantity: product.quantity,
            price: product.price,
            productName: product.productName,
          })),
          total: calculateTotal(),
        }),
      });

      if (response.ok) {
        navigate("/payment-success");
      } else {
        alert("Đã xảy ra lỗi khi xử lý thanh toán.");
      }
    } catch (error) {
      alert("Không thể kết nối đến server.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Thanh toán</h1>
      {products.length === 0 ? (
        <p>Giỏ hàng trống, không có sản phẩm để thanh toán.</p>
      ) : (
        <>
          <table className="min-w-full table-auto border-collapse border-2 border-gray-300">
            <thead>
              <tr className="border-b-2 border-gray-300">
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
                  <tr key={product.productId} className="border-b transition-opacity duration-300">
                    <td className="px-6 py-4 flex items-center">
                      <img
                        src={product.image}
                        alt={product.productName}
                        className="w-16 h-16 object-cover rounded-lg mr-4"
                      />
                      {product.productName}
                    </td>
                    <td className="px-6 py-4">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4">{product.quantity}</td>
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
              onClick={handlePayment}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300 mt-4"
            >
              Thanh toán
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
