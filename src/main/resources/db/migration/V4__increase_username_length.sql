-- V4: Increase username column to hold email addresses used as OAuth login identifiers.
-- RFC 5321 permits email local-parts up to 64 chars and domains up to 255 chars.
-- 255 is the conventional safe maximum for the full address.
ALTER TABLE users ALTER COLUMN username TYPE VARCHAR(255);
