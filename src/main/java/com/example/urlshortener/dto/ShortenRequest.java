package com.example.urlshortener.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
public class ShortenRequest {

    @NotBlank(message = "longUrl is required")
    @URL(message = "longUrl must be a valid URL (include https://)")
    private String longUrl;

    @Size(min = 3, max = 20, message = "Custom code must be 3-20 characters")
    @Pattern(regexp = "^[a-zA-Z0-9-_]*$", message = "Custom code can only contain letters, numbers, - and _")
    private String customCode;
}
