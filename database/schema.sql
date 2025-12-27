-- AgroGig Database Schema
-- This file contains the SQL schema for the AgroGig application

-- Create database
CREATE DATABASE IF NOT EXISTS agrogig;
USE agrogig;

-- Farmers table
CREATE TABLE IF NOT EXISTS farmers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    language VARCHAR(10) DEFAULT 'en',
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Actions table
CREATE TABLE IF NOT EXISTS actions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    date DATETIME NOT NULL,
    description TEXT,
    crop_type VARCHAR(50),
    field_area DECIMAL(10,2),
    score INT DEFAULT 0,
    status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
    INDEX idx_farmer_date (farmer_id, date),
    INDEX idx_type (type),
    INDEX idx_status (status)
);

-- Scores table
CREATE TABLE IF NOT EXISTS scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action_id INT NOT NULL,
    farmer_id INT NOT NULL,
    score INT NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (action_id) REFERENCES actions(id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
    INDEX idx_farmer_category (farmer_id, category),
    INDEX idx_date (created_at)
);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    earned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
    INDEX idx_farmer_date (farmer_id, earned_date)
);

-- Action recommendations table (for storing AI-generated recommendations)
CREATE TABLE IF NOT EXISTS recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT NOT NULL,
    action_id INT,
    recommendation TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status ENUM('pending', 'applied', 'dismissed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    applied_at TIMESTAMP NULL,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
    FOREIGN KEY (action_id) REFERENCES actions(id) ON DELETE SET NULL,
    INDEX idx_farmer_status (farmer_id, status)
);

-- Weather data table (for storing historical weather data)
CREATE TABLE IF NOT EXISTS weather_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    temperature DECIMAL(5,2),
    humidity DECIMAL(5,2),
    rainfall DECIMAL(5,2),
    wind_speed DECIMAL(5,2),
    pressure DECIMAL(7,2),
    condition VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_location_date (location, date),
    INDEX idx_location_date (location, date)
);

-- Indexes for performance optimization
CREATE INDEX idx_actions_farmer_date ON actions(farmer_id, date DESC);
CREATE INDEX idx_scores_farmer_date ON scores(farmer_id, created_at DESC);
CREATE INDEX idx_badges_farmer_date ON badges(farmer_id, earned_date DESC);

-- Sample data insertion (optional)
-- INSERT INTO farmers (name, email, phone, language, location) VALUES
-- ('Rajesh Kumar', 'rajesh@example.com', '+919876543210', 'en', 'Punjab, India'),
-- ('Priya Sharma', 'priya@example.com', '+919876543211', 'hi', 'Uttar Pradesh, India');

-- INSERT INTO actions (farmer_id, type, date, description, crop_type, field_area, score, status) VALUES
-- (1, 'watering', '2025-03-15 08:30:00', 'Watered tomato plants in the morning', 'tomato', 2.5, 12, 'verified'),
-- (1, 'weeding', '2025-03-14 10:15:00', 'Removed weeds from the vegetable garden', 'mixed', 1.2, 10, 'verified'),
-- (1, 'fertilizing', '2025-03-10 16:45:00', 'Applied organic fertilizer to tomato plants', 'tomato', 2.5, 8, 'verified');

-- INSERT INTO scores (action_id, farmer_id, score, category) VALUES
-- (1, 1, 12, 'water'),
-- (2, 1, 10, 'weed'),
-- (3, 1, 8, 'fertilizer');

-- INSERT INTO badges (farmer_id, name, description, earned_date) VALUES
-- (1, 'Smart Irrigator', 'For consistent and efficient watering practices', '2025-03-10 10:00:00'),
-- (1, 'Soil Protector', 'For maintaining excellent soil health', '2025-03-15 14:30:00'),
-- (1, 'Weed Warrior', 'For proactive weed management', '2025-03-20 09:15:00');