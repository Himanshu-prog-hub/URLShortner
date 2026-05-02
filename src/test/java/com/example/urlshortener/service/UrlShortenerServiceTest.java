package com.example.urlshortener.service;

import com.example.urlshortener.dto.ShortenRequest;
import com.example.urlshortener.dto.ShortenResponse;
import com.example.urlshortener.exception.CodeAlreadyExistsException;
import com.example.urlshortener.exception.UrlNotFoundException;
import com.example.urlshortener.model.UrlMapping;
import com.example.urlshortener.repository.UrlRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UrlShortenerServiceTest {

    @Mock
    private UrlRepository urlRepository;

    private UrlShortenerServiceImpl service;

    @BeforeEach
    void setUp() {
        service = new UrlShortenerServiceImpl(urlRepository, "http://localhost:8080", 6);
    }

    @Test
    void shorten_shouldReturnShortenResponse_whenValidRequest() {
        ShortenRequest request = new ShortenRequest();
        request.setLongUrl("https://www.example.com/some/long/path");

        when(urlRepository.existsByShortCode(anyString())).thenReturn(false);
        when(urlRepository.save(any(UrlMapping.class))).thenAnswer(inv -> inv.getArgument(0));

        ShortenResponse response = service.shorten(request);

        assertThat(response.getLongUrl()).isEqualTo("https://www.example.com/some/long/path");
        assertThat(response.getShortCode()).hasSize(6);
        assertThat(response.getShortUrl()).startsWith("http://localhost:8080/");
        assertThat(response.getCreatedAt()).isNotNull();
        verify(urlRepository, times(1)).save(any(UrlMapping.class));
    }

    @Test
    void shorten_shouldThrowCodeAlreadyExistsException_whenCustomCodeTaken() {
        ShortenRequest request = new ShortenRequest();
        request.setLongUrl("https://example.com");
        request.setCustomCode("my-blog");

        when(urlRepository.existsByShortCode("my-blog")).thenReturn(true);

        assertThatThrownBy(() -> service.shorten(request))
                .isInstanceOf(CodeAlreadyExistsException.class)
                .hasMessageContaining("my-blog");
    }

    @Test
    void shorten_shouldReturnExistingMapping_whenUrlOnlyDiffersByTrailingSlash() {
        ShortenRequest request = new ShortenRequest();
        request.setLongUrl("https://www.himanshumishra.site/");

        UrlMapping existing = UrlMapping.builder()
                .shortCode("abc123")
                .longUrl("https://www.himanshumishra.site")
                .createdAt(LocalDateTime.now())
                .clickCount(0)
                .build();

        when(urlRepository.findByLongUrl("https://www.himanshumishra.site"))
                .thenReturn(Optional.of(existing));

        ShortenResponse response = service.shorten(request);

        assertThat(response.getShortCode()).isEqualTo("abc123");
        assertThat(response.getLongUrl()).isEqualTo("https://www.himanshumishra.site");
        verify(urlRepository, never()).save(any(UrlMapping.class));
    }

    @Test
    void resolveAndTrack_shouldReturnLongUrl_andIncrementClick() {
        UrlMapping existing = UrlMapping.builder()
                .shortCode("abc123")
                .longUrl("https://example.com")
                .createdAt(LocalDateTime.now())
                .clickCount(5)
                .build();

        when(urlRepository.findByShortCode("abc123")).thenReturn(Optional.of(existing));

        String result = service.resolveAndTrack("abc123");

        assertThat(result).isEqualTo("https://example.com");
        verify(urlRepository).incrementClickCount("abc123");
    }

    @Test
    void resolveAndTrack_shouldThrowUrlNotFoundException_whenCodeNotFound() {
        when(urlRepository.findByShortCode("xxxxxx")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.resolveAndTrack("xxxxxx"))
                .isInstanceOf(UrlNotFoundException.class)
                .hasMessageContaining("xxxxxx");
    }

    @Test
    void delete_shouldSucceed_whenCodeExists() {
        when(urlRepository.deleteByShortCode("abc123")).thenReturn(true);
        assertThatCode(() -> service.delete("abc123")).doesNotThrowAnyException();
    }

    @Test
    void delete_shouldThrow_whenCodeNotFound() {
        when(urlRepository.deleteByShortCode("xxxxxx")).thenReturn(false);
        assertThatThrownBy(() -> service.delete("xxxxxx"))
                .isInstanceOf(UrlNotFoundException.class);
    }
}
