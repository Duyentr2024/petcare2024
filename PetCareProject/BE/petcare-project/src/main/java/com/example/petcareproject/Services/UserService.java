package com.example.petcareproject.Services;

import com.example.petcareproject.Model.Role;
import com.example.petcareproject.Model.User;
import com.example.petcareproject.Model.UserRole;
import com.example.petcareproject.Repository.UserRepository;
import com.example.petcareproject.Repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    public void save(User user) {userRepository.save(user);}

    public User findByEmail(String email) {return userRepository.findByEmail(email);}

    public User findByUserId(Long id) {return userRepository.findByUserId(id);}

    public void assignRoleToUser(User user, Role role) {
        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRole(role);
        userRoleRepository.save(userRole);
    }

    public String getUserId(User user) {
        return user.getUserId().toString();
    }

    public String getUserById(Long userId) {
        return userRepository.findByUserId(userId).getEmail();
    }

    public String getUserRole(User user) {
        UserRole userRole = userRoleRepository.findByUser(user);
        if (userRole != null) {
            return userRole.getRole().getRoleName();
        }
        return null;
    }

}
