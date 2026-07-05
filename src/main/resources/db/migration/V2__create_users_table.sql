-- V2: Create the users table for authentication
CREATE TABLE users
(
    id            BIGSERIAL                NOT NULL,
    username      VARCHAR(50)              NOT NULL,
    password_hash VARCHAR(255)             NOT NULL,
    -- Stores BCrypt hash, NEVER the plain password
    -- BCrypt hashes are always 60 chars; 255 gives room for future algorithms

    role          VARCHAR(20)              NOT NULL DEFAULT 'ROLE_USER',
    -- Stores the role as a string: ROLE_USER or ROLE_ADMIN
    -- EnumType.STRING in JPA maps to this column

    enabled       BOOLEAN                  NOT NULL DEFAULT TRUE,
    -- Set to FALSE to soft-ban a user without deleting their data

    created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_users          PRIMARY KEY (id),
    CONSTRAINT uq_users_username UNIQUE (username)
);

COMMENT ON TABLE users IS 'Stores registered adventurer accounts';

CREATE INDEX idx_users_username ON users (username);
