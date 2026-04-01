-- Create Daycares table
CREATE TABLE IF NOT EXISTS daycares (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    monthly_fee NUMERIC(10, 2) NOT NULL,
    registration_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_seats INTEGER NOT NULL,
    available_seats INTEGER NOT NULL,
    age_groups_accepted TEXT[] NOT NULL, -- Array of strings e.g., ['0-2', '3-5']
    overall_rating DECIMAL(3, 2) DEFAULT 0.00,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for geospatial queries (optional but good practice)
CREATE INDEX idx_daycares_lat_long ON daycares (latitude, longitude);

-- Create index for filtering fields
CREATE INDEX idx_daycares_fees ON daycares (monthly_fee);
CREATE INDEX idx_daycares_rating ON daycares (overall_rating);

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Saved Daycares junction table (Favorites)
CREATE TABLE IF NOT EXISTS saved_daycares (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    daycare_id INTEGER REFERENCES daycares(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, daycare_id)
);

-- Create Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Optional, can be null for guest inquiries
    daycare_id INTEGER NOT NULL REFERENCES daycares(id) ON DELETE CASCADE,
    parent_name VARCHAR(255) NOT NULL,
    parent_email VARCHAR(255) NOT NULL,
    child_age VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Phase 15: Create Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    daycare_id INTEGER NOT NULL REFERENCES daycares(id) ON DELETE CASCADE,
    parent_name VARCHAR(255) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
