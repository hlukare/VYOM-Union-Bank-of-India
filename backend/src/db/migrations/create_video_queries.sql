CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS video_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    file_url TEXT NOT NULL,
    transcript TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('in_progress', 'processed', 'assigned')),
    is_deleted BOOLEAN DEFAULT FALSE,
    assigned_to UUID,
    created_at TIMESTAMP DEFAULT NOW()
);
