-- Migration to add action_type column to scores table for PostgreSQL/Supabase
ALTER TABLE scores ADD COLUMN IF NOT EXISTS action_type VARCHAR(50);