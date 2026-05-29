package com.roopa.stock.controller;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Map<String, Object> errorDetails = new HashMap<>();

        int statusCode = HttpStatus.INTERNAL_SERVER_ERROR.value();
        if (status != null) {
            statusCode = Integer.parseInt(status.toString());
        }

        errorDetails.put("status", statusCode);
        if (statusCode == HttpStatus.NOT_FOUND.value()) {
            errorDetails.put("error", "Not Found");
            errorDetails.put("message", "The requested resource was not found");
        } else {
            errorDetails.put("error", "Error");
            errorDetails.put("message", "An unexpected error occurred");
        }

        return new ResponseEntity<>(errorDetails, HttpStatus.valueOf(statusCode));
    }
}
