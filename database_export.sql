-- Gemlaunch Rewards System Database Export
-- Generated for developer team setup

-- Drop existing tables if they exist
DROP TABLE IF EXISTS accolades CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS point_configs CASCADE;
DROP TABLE IF EXISTS blockchain_events CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    wallet_address TEXT UNIQUE NOT NULL,
    username TEXT,
    total_points INTEGER DEFAULT 0,
    referral_code TEXT UNIQUE,
    referred_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create activities table
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    activity_type TEXT NOT NULL,
    points INTEGER DEFAULT 0,
    transaction_hash TEXT,
    block_number INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create accolades table
CREATE TABLE accolades (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    accolade_type TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    multiplier NUMERIC DEFAULT 1.0,
    unlocked_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create referrals table
CREATE TABLE referrals (
    id SERIAL PRIMARY KEY,
    referrer_id INTEGER REFERENCES users(id) NOT NULL,
    referee_id INTEGER REFERENCES users(id) NOT NULL,
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create point_configs table
CREATE TABLE point_configs (
    id SERIAL PRIMARY KEY,
    activity_type TEXT UNIQUE NOT NULL,
    base_points INTEGER DEFAULT 0,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create blockchain_events table
CREATE TABLE blockchain_events (
    id SERIAL PRIMARY KEY,
    event_type TEXT NOT NULL,
    user_address TEXT NOT NULL,
    contract_address TEXT,
    transaction_hash TEXT,
    block_number INTEGER,
    processed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data (current production state)
INSERT INTO users (id, wallet_address, total_points, created_at) VALUES
(3, '0x2d9b878DD5f779aF723a430F8d56f21dAc847592', 7800, '2025-06-14 07:21:17.213287'),
(4, '0x1234567890123456789012345678901234567890', 10600, '2025-06-14 05:30:17.163773'),
(5, '0x0987654321098765432109876543210987654321', 3700, '2025-06-14 05:30:17.163773');

-- Insert activities
INSERT INTO activities (id, user_id, activity_type, points, created_at) VALUES
(10, 3, 'welcome_bonus', 300, '2025-06-14 08:04:17.175846'),
(19, 4, 'token_creation', 500, '2025-06-14 05:30:24.548036'),
(20, 4, 'fair_launch', 300, '2025-06-14 05:30:24.548036'),
(21, 4, 'volume_trading', 250, '2025-06-14 05:30:24.548036'),
(22, 4, 'presale_participation', 200, '2025-06-14 05:30:24.548036'),
(23, 5, 'token_creation', 500, '2025-06-14 05:30:24.548036'),
(24, 5, 'volume_trading', 175, '2025-06-14 05:30:24.548036'),
(25, 5, 'referral_bonus', 200, '2025-06-14 05:30:24.548036');

-- Insert accolades
INSERT INTO accolades (id, user_id, accolade_type, unlocked_at) VALUES
(6, 3, 'gemlaunch_pioneer', '2025-06-14 08:04:17.144733'),
(16, 3, 'genesis_member', '2025-06-14 09:45:13.532771'),
(17, 3, 'early_adopter', '2025-06-14 09:45:13.532771'),
(14, 4, 'gemlaunch_pioneer', '2025-06-14 05:30:17'),
(18, 4, 'genesis_member', '2025-06-14 05:30:17'),
(19, 4, 'early_adopter', '2025-06-14 05:30:17'),
(20, 4, 'token_creator', '2025-06-14 05:30:30'),
(21, 4, 'launch_master', '2025-06-14 05:30:35'),
(22, 4, 'funding_veteran', '2025-06-14 05:30:40'),
(23, 4, 'presale_participant', '2025-06-14 05:30:45'),
(15, 5, 'gemlaunch_pioneer', '2025-06-14 05:30:17'),
(24, 5, 'early_adopter', '2025-06-14 05:30:17'),
(25, 5, 'token_creator', '2025-06-14 05:30:30'),
(26, 5, 'first_funding', '2025-06-14 05:30:40');

-- Insert point configurations
INSERT INTO point_configs (activity_type, base_points, description, is_active) VALUES
('token_creation', 100, 'Create a new token', true),
('fair_launch', 500, 'Launch a fair launch campaign', true),
('presale', 750, 'Create and run a presale', true),
('dutch_auction', 1000, 'Host a Dutch auction', true),
('volume_contribution', 1, 'Points per dollar of funding volume', true),
('referral_bonus', 50, 'Successful referral bonus', true),
('daily_login', 10, 'Daily login streak bonus', true);

-- Reset sequences to current max values
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('activities_id_seq', (SELECT MAX(id) FROM activities));
SELECT setval('accolades_id_seq', (SELECT MAX(id) FROM accolades));
SELECT setval('referrals_id_seq', 1);
SELECT setval('point_configs_id_seq', (SELECT MAX(id) FROM point_configs));
SELECT setval('blockchain_events_id_seq', 1);

-- Create indexes for performance
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_type ON activities(activity_type);
CREATE INDEX idx_accolades_user_id ON accolades(user_id);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_blockchain_events_processed ON blockchain_events(processed);