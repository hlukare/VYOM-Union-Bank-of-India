CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    dob DATE,
    gender VARCHAR(10) CHECK (gender IN ('M', 'F', 'Other')),
    email VARCHAR(255) UNIQUE DEFAULT NULL,
    mobile_number VARCHAR(15) UNIQUE NOT NULL,
    aadhar_number VARCHAR(12) UNIQUE,
    pan_number VARCHAR(10) UNIQUE DEFAULT NULL,
    occupation VARCHAR(255) DEFAULT NULL,
    annual_income DECIMAL(15,2) DEFAULT NULL,
    marital_status VARCHAR(50) DEFAULT NULL CHECK (marital_status IN ('Single', 'Married', 'Divorced', 'Widowed')),
    aadhar_photo_link TEXT ,
    facial_embedding FLOAT[] DEFAULT NULL,
    kyc_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected')),
    registration_status VARCHAR(50) NOT NULL DEFAULT 'pan' CHECK (
        registration_status IN (
            'pan',
            'aadhar',
            'email',
            'face',
            'document',
            'other',
            'vkyc',
            'completed'
        )
    ),
    refresh_token VARCHAR(255) DEFAULT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexing for Faster Queries
CREATE INDEX idx_users_aadhaar ON users(aadhar_number);
CREATE INDEX idx_users_phone ON users(mobile_number);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(registration_status);

