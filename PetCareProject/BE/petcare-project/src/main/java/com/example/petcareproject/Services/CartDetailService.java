package com.example.petcareproject.Services;

import com.example.petcareproject.Model.CartDetail;
import com.example.petcareproject.Repository.CartDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
public class CartDetailService {

    @Autowired
    private CartDetailRepository cartDetailRepository;

    public List<CartDetail> getAllCartDetails() {
        return cartDetailRepository.findAll();
    }

    public Optional<CartDetail> getCartDetailById(Long id) {
        return cartDetailRepository.findById(id);
    }

    public CartDetail saveCartDetail(CartDetail cartDetail) {
        return cartDetailRepository.save(cartDetail);
    }

    public void deleteCartDetail(Long id) {
        cartDetailRepository.deleteById(id);
    }
}
