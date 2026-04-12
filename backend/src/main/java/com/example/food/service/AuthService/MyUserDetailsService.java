package com.example.food.service.AuthService;


import com.example.food.entity.UserPrincipal;
import com.example.food.entity.Users;
import com.example.food.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service // Marks this class as a Spring service, making it a managed bean
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepo userRepo; // Injects the UserRepo to interact with the database for user data


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Fetch the user from the database using the username
        Users user = userRepo.findByEmail(email);

        // If the user is not found, throw an exception
        if (user == null) {
            System.out.println("User is not found"); // Log the error (for debugging purposes)
            throw new UsernameNotFoundException("User not found"); // Throw an exception to indicate the user was not found
        }

        // Wrap the user in a UserPrincipal object and return it
        return new UserPrincipal(user);
    }
}