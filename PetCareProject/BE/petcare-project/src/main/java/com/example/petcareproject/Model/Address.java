package com.example.petcareproject.Model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long addressId;

    @Column(name = "district", columnDefinition = "NVARCHAR(255)")
    private String district;

    @Column(name = "province", columnDefinition = "NVARCHAR(255)")
    private String province;

    @Column(name = "street", columnDefinition = "NVARCHAR(255)")
    private String street;

    @Column(name = "fullAddress", columnDefinition = "NVARCHAR(255)")
    private String fullAddress;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

}
