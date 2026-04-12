package com.example.food.entity;


import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
public class UserPrincipal implements UserDetails {

    private final Users user; // The Users object representing the authenticated user


    public UserPrincipal(Users user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name()) // Grants the "USER" role to the user
        );
    }


    @Override
    public String getPassword() {
        return user.getPassword(); // Retrieves the password from the Users object
    }


    @Override
    public String getUsername() {
        return user.getEmail(); // Retrieves the username from the Users object
    }


    @Override
    public boolean isAccountNonExpired() {
        return true; // The account is always considered non-expired
    }


    @Override
    public boolean isAccountNonLocked() {
        return true; // The account is always considered non-locked
    }


    @Override
    public boolean isCredentialsNonExpired() {
        return true; // The credentials are always considered non-expired
    }


    @Override
    public boolean isEnabled() {
        return true; // The user is always considered enabled
    }
}