-- V1: Create the url_mapping table
CREATE TABLE url_mapping
(
    id          BIGSERIAL                NOT NULL,
    short_code  VARCHAR(50)              NOT NULL,
    long_url    TEXT                     NOT NULL,
    click_count INTEGER                  NOT NULL DEFAULT 0,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_url_mapping  PRIMARY KEY (id),
    CONSTRAINT uq_url_mapping_short_code UNIQUE (short_code)
);

COMMENT ON TABLE url_mapping IS 'Stores shortened URL mappings';

CREATE INDEX idx_url_mapping_short_code ON url_mapping (short_code);
