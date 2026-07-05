package com.example.urlshortener.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.urlshortener.dto.ShortenRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class UrlShortenerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "testUser")
    void postShorten_shouldReturn201_withValidRequest() throws Exception {
        ShortenRequest request = new ShortenRequest();
        request.setLongUrl("https://www.example.com/test");

        mockMvc.perform(post("/shorten")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.shortCode").exists())
                .andExpect(jsonPath("$.shortCode", hasLength(6)))
                .andExpect(jsonPath("$.longUrl").value("https://www.example.com/test"));
    }

    @Test
    @WithMockUser(username = "testUser")
    void postShorten_shouldReturn400_whenLongUrlIsBlank() throws Exception {
        ShortenRequest request = new ShortenRequest();
        request.setLongUrl("");

        mockMvc.perform(post("/shorten")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.longUrl").exists());
    }

    @Test
    @WithMockUser(username = "testUser")
    void getStats_shouldReturn404_forNonExistentCode() throws Exception {
        mockMvc.perform(get("/stats/nonexistent"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    @WithMockUser(username = "testUser")
    void fullFlow_shortenThenRedirectThenStats() throws Exception {
        ShortenRequest request = new ShortenRequest();
        request.setLongUrl("https://www.github.com");

        MvcResult result = mockMvc.perform(post("/shorten")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        String responseJson = result.getResponse().getContentAsString();
        String shortCode = objectMapper.readTree(responseJson).get("shortCode").asText();

        // Redirect is public — no auth header needed
        mockMvc.perform(get("/" + shortCode))
                .andExpect(status().isFound())
                .andExpect(header().string("Location", "https://www.github.com"));

        mockMvc.perform(get("/stats/" + shortCode))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.clickCount").value(1));
    }
}
