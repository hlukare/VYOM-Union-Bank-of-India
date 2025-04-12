
CREATE TABLE IF NOT EXISTS video_kyc_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP NOT NULL,
    agent_id UUID,  -- Reference to KYC agent (if applicable)
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'failed', 'rejected')),
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);