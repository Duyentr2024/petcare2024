package com.example.petcareproject.Controller;

import com.example.petcareproject.Model.Role;
import com.example.petcareproject.Model.User;
import com.example.petcareproject.Services.PasswordEncoderService;
import com.example.petcareproject.Services.RoleService;
import com.example.petcareproject.Services.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService rolesService;

    @Autowired
    private PasswordEncoderService passwordEncoderService;
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        // Kiểm tra email đã tồn tại chưa
        if (userService.findByEmail(user.getEmail()) != null) {
            return "Email đã được sử dụng!";
        }
        // Mã hóa mật khẩu trước khi lưu
        String encodedPassword = passwordEncoderService.encodePassword(user.getPassword());
        user.setPassword(encodedPassword);
        // Lưu người dùng vào cơ sở dữ liệu
        userService.save(user);
        // Gán vai trò mặc định cho người dùng
        Role userRole = rolesService.findByRoleName("Người dùng");
        userService.assignRoleToUser(user, userRole);
        return "Đăng ký thành công!";
    }
    @PostMapping("/login")
    public Map<String, Object> login(@RequestParam String email, @RequestParam String password,
                                     HttpSession session, HttpServletResponse response) {
        User user = userService.findByEmail(email);
        if (user == null || !passwordEncoderService.matches(password, user.getPassword())) {
            return Map.of("message", "Thông tin đăng nhập không chính xác!", "status", false);
        }

        // Lưu thông tin người dùng vào session
        session.setAttribute("loggedInUser", user);

        // Tạo cookie để lưu trữ session ID
        Cookie cookie = new Cookie("SESSIONID", session.getId());
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);

        // Trả về thông tin người dùng và quyền của họ
        String role = userService.getUserRole(user);
        return Map.of("message", "Đăng nhập thành công!", "status", true, "user", user.getEmail(), "role", role);
    }

    // Đăng xuất
    @PostMapping("/logout")
    public String logout(HttpSession session, HttpServletResponse response) {
        session.invalidate(); // Hủy session
        Cookie cookie = new Cookie("SESSIONID", null); // Xóa cookie
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);
        return "Đăng xuất thành công!";
    }
}
