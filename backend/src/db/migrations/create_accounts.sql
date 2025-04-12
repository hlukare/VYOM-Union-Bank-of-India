CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    account_number VARCHAR(20) UNIQUE NOT NULL,  
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('savings', 'current', 'fixed_deposit')),
    balance DECIMAL(15,2) NOT NULL DEFAULT 0.00, 
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'closed', 'frozen')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
