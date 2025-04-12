CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE service_ticket_priority AS ENUM ('low', 'medium', 'high');

CREATE TABLE IF NOT EXISTS service_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(12) UNIQUE NOT NULL,
    user_id UUID NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('loan', 'transaction', 'account_issue', 'general')), 
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('open', 'in_progress', 'closed')),
    assigned_to UUID,
    priority service_ticket_priority NOT NULL DEFAULT 'low',
    video_query_id UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
