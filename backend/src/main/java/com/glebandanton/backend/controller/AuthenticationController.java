package com.glebandanton.backend.controller;

import com.glebandanton.backend.config.JwtProvider;
import com.glebandanton.backend.model.User;
import com.glebandanton.backend.repository.UserRepo;
import com.glebandanton.backend.request.LoginRequest;
import com.glebandanton.backend.response.AuthResponse;
import com.glebandanton.backend.response.UserInfo;
import com.glebandanton.backend.service.impl.CustomeUserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private CustomeUserDetailsImpl customUserDetails;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) throws Exception {
        System.out.println("=== SIGNUP REQUEST RECEIVED ===");
        System.out.println("Registration attempt for email: " + user.getEmail() + ", username: " + user.getUsername());
        
        User isUserExist = userRepo.findByEmail(user.getEmail());

        if(isUserExist != null){
            System.out.println("Email already exists: " + user.getEmail());
            throw new Exception("email already exist with another account");
        }

        User createdUser = new User();
        createdUser.setPassword(passwordEncoder.encode(user.getPassword()));
        createdUser.setEmail(user.getEmail());
        createdUser.setUsername(user.getUsername());

        // Assign role
        if (userRepo.count() == 0) {
            createdUser.setRole("ADMIN");
        } else {
            createdUser.setRole("USER");
        }

        User savedUser = userRepo.save(createdUser);
        System.out.println("User created: " + savedUser.getUsername() + ", Role: " + savedUser.getRole());

        Authentication authentication = authenticate(user.getEmail(), user.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = JwtProvider.generateToken(authentication);

        // Создаем информацию о пользователе
        UserInfo userInfo = new UserInfo();
        userInfo.setUserId(savedUser.getUser_id());
        userInfo.setEmail(savedUser.getEmail());
        userInfo.setUsername(savedUser.getUsername());
        userInfo.setRole(savedUser.getRole());

        AuthResponse response = new AuthResponse();
        response.setMessage("signup success");
        response.setJwt(jwt);
        response.setUser(userInfo);

        System.out.println("Signup successful for user: " + savedUser.getUsername() + " with role: " + savedUser.getRole());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signIN(@RequestBody LoginRequest loginRequest){
        System.out.println("=== SIGNIN REQUEST RECEIVED ===");
        String username = loginRequest.getEmail();
        String password = loginRequest.getPassword();
        System.out.println("Login attempt for email: " + username);

        Authentication authentication = authenticate(username, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = JwtProvider.generateToken(authentication);

        // Получаем информацию о пользователе
        User user = userRepo.findByEmail(username);
        System.out.println("User found: " + user.getUsername() + ", Role: " + user.getRole());
        
        // Создаем информацию о пользователе
        UserInfo userInfo = new UserInfo();
        userInfo.setUserId(user.getUser_id());
        userInfo.setEmail(user.getEmail());
        userInfo.setUsername(user.getUsername());
        userInfo.setRole(user.getRole());

        AuthResponse response = new AuthResponse();
        response.setMessage("sign-in success");
        response.setJwt(jwt);
        response.setUser(userInfo);

        System.out.println("Signin successful for user: " + user.getUsername() + " with role: " + user.getRole());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    private Authentication authenticate(String username, String password) {
        UserDetails userDetails = customUserDetails.loadUserByUsername(username);

        if(userDetails == null) {
            throw new BadCredentialsException("invalid username");
        }
        if(!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("invalid password");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}
