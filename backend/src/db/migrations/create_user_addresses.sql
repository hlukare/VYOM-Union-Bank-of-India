CREATE TABLE IF NOT EXISTS user_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    address_type VARCHAR(20) NOT NULL CHECK (address_type IN ('permanent', 'temporary')),
    country VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    city VARCHAR(100),
    po VARCHAR(100),
    pincode VARCHAR(10) NOT NULL,
    street VARCHAR(255),
    house VARCHAR(255),
    landmark VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, address_type)
);

CREATE INDEX idx_addresses_user_id ON user_addresses(user_id);
CREATE INDEX idx_addresses_pincode ON user_addresses(pincode);