CREATE TABLE IF NOT EXISTS user_otps(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    otp VARCHAR(6) NOT NULL,
    otp_type VARCHAR(10) NOT NULL CHECK (otp_type IN ('phone', 'email')),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_otp_user ON user_otps(user_id);
