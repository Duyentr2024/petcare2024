import React, { useState } from "react";
import ProductItem from "../product/ProductItem";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "../header/Header";
import ReactPaginate from "react-paginate";

const productsList = [
  {
    id: 1,
    name: "Hạt dành cho chó",
    price: "1.999.000đ",
    image: "/src/assets/product8.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "Hạt dành cho chó",
    price: "1.999.000đ",
    image: "/src/assets/product3.jpg",
    rating: 1,
  },
  {
    id: 3,
    name: "Bát ăn cho mèo",
    price: "2.500.000đ",
    image: "/src/assets/product6.jpg",
    rating: 3,
  },
  {
    id: 4,
    name: "Hạt dành cho mèo",
    price: "1.800.000đ",
    image: "/src/assets/product7.jpg",
    rating: 2,
  },
  {
    id: 5,
    name: "Bát ăn thú cưng",
    price: "3.200.000đ",
    image: "/src/assets/product2.jpg",
    rating: 4,
  },
  {
    id: 6,
    name: "Túi pate cho mèo",
    price: "2.100.000đ",
    image: "/src/assets/product5.jpg",
    rating: 5,
  },
  {
    id: 7,
    name: "Bát ăn thú cưng",
    price: "3.200.000đ",
    image: "/src/assets/product2.jpg",
    rating: 4,
  },
  {
    id: 8,
    name: "Túi pate cho mèo",
    price: "2.100.000đ",
    image: "/src/assets/product5.jpg",
    rating: 5,
  },
];

const PRODUCTS_PER_PAGE = 4; // Số sản phẩm hiển thị mỗi trang

export default function Products() {
  // Trạng thái cho trang hiện tại
  const [currentPage, setCurrentPage] = useState(0);

  // Tính toán các sản phẩm hiển thị cho trang hiện tại
  const offset = currentPage * PRODUCTS_PER_PAGE;
  const currentProducts = productsList.slice(
    offset,
    offset + PRODUCTS_PER_PAGE
  );

  // Hàm xử lý phân trang
  const handlePageChange = (data) => {
    setCurrentPage(data.selected);
  };

  const [showDogShop, setShowDogShop] = useState(false);
  const [showCatShop, setShowCatShop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleDogShopClick = () => {
    setShowDogShop((prev) => !prev);
    setSelectedCategory((prev) => (prev === "dog" ? null : "dog"));
  };

  const handleCatShopClick = () => {
    setShowCatShop((prev) => !prev);
    setSelectedCategory((prev) => (prev === "cat" ? null : "cat"));
  };

  return (
    <>
      <Header />
      <div className="flex flex-wrap mx-32">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 p-4">
          {/* Categories */}
          <div className="mb-8">
            <div
              className="bg-[#00b7c0] text-white ml-[3px] px-4 py-2 font-bold text-center w-[140px]"
              style={{ transform: "skewX(-10deg)" }}
            >
              <span style={{ transform: "skewX(10deg)" }}>DANH MỤC</span>
            </div>
            <div className="flex-grow border-t border-[#00b7c0] mb-2 border-2"></div>

            <ul className="border-2 border-[#00b7c0] rounded-md p-4 space-y-2">
              <li
                className={`cursor-pointer hover:text-[#00b7c0] transition flex justify-between items-center ${
                  selectedCategory === "dog"
                    ? "text-[#00b7c0]"
                    : ""
                }`}
                onClick={handleDogShopClick}
              >
                SHOP CHO CÚN
                <i
                  className={`fa ${
                    showDogShop ? "fa-angle-up" : "fa-angle-down"
                  }`}
                ></i>
              </li>
              {showDogShop && (
                <ul className="pl-4 space-y-4 ">
                  {[
                    "Thức ăn & pate",
                    "Bát ăn",
                    "Vòng cổ dây dắt",
                    "Thuốc và dinh dưỡng",
                    "Sữa tắm & dụng cụ vệ sinh",
                    "Chuồng, nệm và túi vận chuyển",
                    "Đồ chơi thú cưng",
                  ].map((item) => (
                    <li
                      key={item}
                      className="cursor-pointer hover:text-[#00b7c0] transition"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              <li
                className={`cursor-pointer hover:text-[#00b7c0] transition flex justify-between items-center ${
                  selectedCategory === "cat"
                    ? "text-[#00b7c0]"
                    : ""
                }`}
                onClick={handleCatShopClick}
              >
                SHOP CHO MÈO
                <i
                  className={`fa ${
                    showCatShop ? "fa-angle-up" : "fa-angle-down"
                  }`}
                ></i>
              </li>
              {showCatShop && (
                <ul className="pl-4 space-y-4">
                  {[
                    "Thức ăn & pate",
                    "Bát ăn",
                    "Vòng cổ dây dắt",
                    "Thuốc và dinh dưỡng",
                    "Sữa tắm & dụng cụ vệ sinh",
                    "Chuồng, nệm và túi vận chuyển",
                    "Đồ chơi thú cưng",
                  ].map((item) => (
                    <li
                      key={item}
                      className="cursor-pointer hover:text-[#00b7c0] transition space-y-4"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              <li className="cursor-pointer hover:text-[#00b7c0] transition">
                KHUYẾN MÃI
              </li>
              <li className="cursor-pointer hover:text-[#00b7c0] transition" >
                TIN TỨC
              </li>
            </ul>
          </div>

          {/* Brand Filter */}
          <div className="mb-8">
            <div
              className="bg-[#00b7c0] text-white ml-[3px] px-4 py-2 font-bold w-[140px] text-center"
              style={{ transform: "skewX(-10deg)" }}
            >
              <span style={{ transform: "skewX(10deg)" }}>THƯƠNG HIỆU</span>
            </div>
            <div className="flex-grow border-t border-[#00b7c0] border-2 mb-2 w-full"></div>
            <ul className="border-2 border-[#00b7c0] rounded-md p-4 space-y-2">
              {["Khác", "ROYAL CANIN"].map((brand) => (
                <li key={brand} className="flex items-center custom-radio">
                  <input type="radio" name="brand" className="mr-2" /> {brand}
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range Filter */}
          <div className="mb-8">
            <div
              className="bg-[#00b7c0] text-white px-4 py-2 ml-[3px] font-bold w-[140px] text-center"
              style={{ transform: "skewX(-10deg)" }}
            >
              <span style={{ transform: "skewX(10deg)" }}>KHOẢNG GIÁ</span>
            </div>
            <div className="flex-grow border-t border-[#00b7c0]  mb-2 w-full"></div>
            <ul className="border-2 border-[#00b7c0] rounded-md p-4 space-y-2">
              {[
                "Giá dưới 100.000đ",
                "100.000đ - 200.000đ",
                "200.000đ - 300.000đ",
                "300.000đ - 500.000đ",
                "500.000đ - 1.000.000đ",
              ].map((priceRange) => (
                <li key={priceRange} className="flex items-center custom-radio">
                  <input type="radio" name="price" className="mr-2" />{" "}
                  {priceRange}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Products Section */}
        <div className="w-full md:w-3/4 p-4">
          {/* Sorting */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Thức ăn hạt & pate cho cún</h2>
            <div>
              <label>Sắp xếp theo: </label>
              <select className="border rounded-md p-2">
                <option>Mặc định</option>
                <option>Giá tăng dần</option>
                <option>Giá giảm dần</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productsList.map((product) => (
              <ProductItem
                key={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                rating={product.rating}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
