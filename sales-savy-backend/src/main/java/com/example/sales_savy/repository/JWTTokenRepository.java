package com.example.sales_savy.repository;

import com.example.sales_savy.model.JWTToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Repository
public interface JWTTokenRepository extends JpaRepository<JWTToken, Integer> {
    Optional<JWTToken> findByToken(String token);
    
    @Transactional
    @Modifying
    void deleteByToken(String token);
    
    @Transactional
    @Modifying
    @Query("DELETE FROM JWTToken j WHERE j.user.userId = :userId")
    void deleteByUserUserId(@Param("userId") Integer userId);
}