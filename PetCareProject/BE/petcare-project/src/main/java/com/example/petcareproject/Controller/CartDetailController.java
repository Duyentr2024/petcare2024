package com.example.petcareproject.Controller;

import com.example.petcareproject.Model.CartDetail;
import com.example.petcareproject.Model.ProductDetail;
import com.example.petcareproject.Model.User;
import com.example.petcareproject.Services.CartDetailService;
import com.example.petcareproject.Services.ProductDetailService;
import com.example.petcareproject.Services.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart-details")
@CrossOrigin(origins = "http://localhost:5173")
public class CartDetailController {
    @Autowired
    private CartDetailService cartDetailService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductDetailService productDetailService;

    @GetMapping
    public List<CartDetail> getAllCartDetails() {
        return cartDetailService.getAllCartDetails();
    }

    @GetMapping("/{id}")
    public Optional<CartDetail> getCartDetailById(@PathVariable Long id) {
        return cartDetailService.getCartDetailById(id);
    }

    @PostMapping
    public CartDetail createCartDetail(@RequestBody CartDetail cartDetail) {
        return cartDetailService.saveCartDetail(cartDetail);
    }

    @PostMapping("/add-to-cart")
    public CartDetail addToCart(@RequestBody Map<String, Object> payload, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        Long productDetailsId = ((Number) payload.get("productDetailsId")).longValue();
        int quantity = (int) payload.get("quantity");

        // Retrieve the User object
        User user = userService.getUserById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // Retrieve the ProductDetail object
        ProductDetail productDetail = productDetailService.getProductDetailById(productDetailsId).orElseThrow(() -> new RuntimeException("ProductDetail not found"));

        // Create a new CartDetail object
        CartDetail cartDetail = new CartDetail();
        cartDetail.setUser(user);
        cartDetail.setProductDetail(productDetail);
        cartDetail.setQuantityItem(quantity);

        // Save the CartDetail object
        return cartDetailService.saveCartDetail(cartDetail);
    }

    @PutMapping("/{id}")
    public CartDetail updateCartDetail(@PathVariable Long id, @RequestBody CartDetail cartDetail) {
        cartDetail.setCartDetailId(id);
        return cartDetailService.saveCartDetail(cartDetail);
    }

    @DeleteMapping("/{id}")
    public void deleteCartDetail(@PathVariable Long id) {
        cartDetailService.deleteCartDetail(id);
    }
}
