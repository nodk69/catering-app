package com.example.food.entity;


import com.example.food.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Data
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @NotBlank
    private String username;
    @Email
    private String email;
    @Size(min = 6)
    private String password;
    private String phone;
    private String address;

    @Enumerated(EnumType.STRING)
    @NotNull
    private Role role;
}