-- V3: Add owner_id FK to url_mapping (nullable for backward compatibility)
ALTER TABLE url_mapping
    ADD COLUMN owner_id BIGINT REFERENCES users (id) ON DELETE SET NULL;

CREATE INDEX idx_url_mapping_owner_id ON url_mapping (owner_id);
