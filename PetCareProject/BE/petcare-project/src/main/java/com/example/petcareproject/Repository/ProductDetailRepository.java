package com.example.petcareproject.Repository;


import com.example.petcareproject.Model.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductDetailRepository extends JpaRepository<ProductDetail, Long> {


    // ProductDetailRepository.java
    @Query("SELECT pd FROM ProductDetail pd WHERE pd.product.productId = :productId")
    ProductDetail findByProductId(@Param("productId") Long productId);



}
