package com.example.urlshortener.exception;

public class CodeAlreadyExistsException extends RuntimeException {

    public CodeAlreadyExistsException(String code) {
        super("Short code '" + code + "' is already in use. Please choose another.");
    }
}
