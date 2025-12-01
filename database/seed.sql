-- AgroGig Seed Data
-- This file contains sample data to populate the database for development/testing

-- Use the agrogig database
USE agrogig;

-- Insert sample farmers
INSERT INTO farmers (name, email, phone, language, location) VALUES
('Rajesh Kumar', 'rajesh@example.com', '+919876543210', 'en', 'Punjab, India'),
('Priya Sharma', 'priya@example.com', '+919876543211', 'hi', 'Uttar Pradesh, India'),
('Suresh Reddy', 'suresh@example.com', '+919876543212', 'kn', 'Karnataka, India');

-- Insert sample actions
INSERT INTO actions (farmer_id, type, date, description, crop_type, field_area, score, status) VALUES
(1, 'watering', '2025-03-15 08:30:00', 'Watered tomato plants in the morning', 'tomato', 2.5, 12, 'verified'),
(1, 'weeding', '2025-03-14 10:15:00', 'Removed weeds from the vegetable garden', 'mixed', 1.2, 10, 'verified'),
(1, 'fertilizing', '2025-03-10 16:45:00', 'Applied organic fertilizer to tomato plants', 'tomato', 2.5, 8, 'verified'),
(1, 'irrigation', '2025-03-08 07:30:00', 'Completed drip irrigation for the cotton field', 'cotton', 3.0, 9, 'verified'),
(1, 'monitoring', '2025-03-05 11:00:00', 'Checked for pest infestation in tomato plants', 'tomato', 2.5, 5, 'verified'),
(2, 'watering', '2025-03-15 07:45:00', 'Watered rice field in the morning', 'rice', 1.5, 11, 'verified'),
(2, 'weeding', '2025-03-13 14:20:00', 'Removed weeds from rice field', 'rice', 1.5, 10, 'verified'),
(2, 'fertilizing', '2025-03-10 17:30:00', 'Applied NPK fertilizer to wheat field', 'wheat', 2.0, 12, 'verified'),
(3, 'seeding', '2025-03-16 09:15:00', 'Planted maize seeds in the prepared field', 'corn', 1.8, 7, 'verified'),
(3, 'watering', '2025-03-17 08:00:00', 'Watered newly planted maize seeds', 'corn', 1.8, 6, 'verified');

-- Insert sample scores
INSERT INTO scores (action_id, farmer_id, score, category) VALUES
(1, 1, 12, 'water'),
(2, 1, 10, 'weed'),
(3, 1, 8, 'fertilizer'),
(4, 1, 9, 'irrigation'),
(5, 1, 5, 'monitoring'),
(6, 2, 11, 'water'),
(7, 2, 10, 'weed'),
(8, 2, 12, 'fertilizer'),
(9, 3, 7, 'seeding'),
(10, 3, 6, 'water');

-- Insert sample badges
INSERT INTO badges (farmer_id, name, description, earned_date) VALUES
(1, 'Smart Irrigator', 'For consistent and efficient watering practices', '2025-03-10 10:00:00'),
(1, 'Soil Protector', 'For maintaining excellent soil health', '2025-03-15 14:30:00'),
(1, 'Weed Warrior', 'For proactive weed management', '2025-03-20 09:15:00'),
(2, 'Fertilizer Expert', 'For optimal fertilizer application', '2025-03-12 11:30:00'),
(2, 'Water Manager', 'For efficient water usage', '2025-03-18 13:45:00'),
(3, 'Planting Pro', 'For excellent seeding techniques', '2025-03-17 10:00:00');

-- Insert sample weather data
INSERT INTO weather_data (location, date, temperature, humidity, rainfall, wind_speed, pressure, condition) VALUES
('Punjab, India', '2025-03-15', 28.5, 65.2, 0.0, 12.3, 1013.2, 'Partly Cloudy'),
('Punjab, India', '2025-03-14', 27.8, 70.5, 0.0, 10.1, 1012.8, 'Cloudy'),
('Punjab, India', '2025-03-10', 29.2, 55.3, 0.0, 8.7, 1014.1, 'Sunny'),
('Uttar Pradesh, India', '2025-03-15', 30.1, 60.8, 0.0, 11.5, 1012.5, 'Clear'),
('Uttar Pradesh, India', '2025-03-13', 29.7, 68.2, 2.5, 9.8, 1011.9, 'Light Rain'),
('Karnataka, India', '2025-03-16', 32.4, 52.1, 0.0, 14.2, 1010.3, 'Hot'),
('Karnataka, India', '2025-03-17', 31.8, 55.7, 0.0, 13.6, 1011.0, 'Sunny');

-- Insert sample recommendations
INSERT INTO recommendations (farmer_id, action_id, recommendation, priority, status) VALUES
(1, 1, 'Water early in the morning or late in the evening to minimize evaporation.', 'medium', 'pending'),
(1, 2, 'Regular weeding prevents pest infestations and disease spread.', 'high', 'pending'),
(2, 6, 'Consider mulching to retain soil moisture in the rice field.', 'medium', 'pending'),
(3, 9, 'Ensure proper spacing between seeds for healthy plant development.', 'high', 'pending');