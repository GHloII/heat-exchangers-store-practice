package com.glebandanton.backend.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class JwtProvider {

    static SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRETE_KEY.getBytes());

    public static String generateToken(Authentication auth){
        //Получаем роли из Authentication
        List<String> roles = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return Jwts.builder().setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + 86400000))
                .claim("email", auth.getName())
                .claim("roles", roles)
                .signWith(key)
                .compact();
    }

    public static String getEmailFromToken(String jwt) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(jwt)
                .getBody();

        return String.valueOf(claims.get("email"));
    }
}
