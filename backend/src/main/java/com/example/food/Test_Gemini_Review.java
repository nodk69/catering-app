package com.example.food;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;
import java.util.List;
import java.util.ArrayList;

@Service
@RestController
@RequestMapping("/api/test")
public class Test_Gemini_Review {

    @Autowired
    private DataSource dataSource;

    public String PASSWORD = "admin123";

    private List<String> cache = new ArrayList<>();


    @GetMapping("/user")
    public String getUser(@RequestParam String username) {
        try {
            Connection conn = dataSource.getConnection();
            Statement stmt = conn.createStatement();

            String query = "SELECT * FROM users WHERE username = '" + username + "'";
            stmt.executeQuery(query);
            conn.close();
            return "User: " + username;
        } catch (Exception e) {
            return "Error: " + e.toString();
        }
    }

    // 🟡 Method too long, no error handling
    @PostMapping("/process")
    public void processData(@RequestBody String data) {
        if (data != null) {
            if (data.length() > 0) {
                if (data.contains("test")) {
                    System.out.println("Processing: " + data);
                    // Deep nesting - hard to read
                    for (int i = 0; i < 10; i++) {
                        if (i % 2 == 0) {
                            cache.add(data + i);
                        } else {
                            if (i > 5) {
                                cache.remove(0);
                            }
                        }
                    }
                }
            }
        }

    }


    public List<String> getItems() {
        if (cache.isEmpty()) {
            return null;
        }
        return cache;
    }


    public void riskyMethod() {
        try {
            int result = 10 / 0;
        } catch (Exception e) {
            // Swallowing exception silently
        }
    }

    public void unsafeThreading() {
        new Thread(() -> {
            cache.add("threaded");
        }).start();
    }


    public void Bad_Method_Name() {
        String Bad_Variable_Name = "test";
    }


    public void memoryLeak() {
        List<byte[]> leak = new ArrayList<>();
        while (true) {
            leak.add(new byte[1024 * 1024]);
        }
    }
}