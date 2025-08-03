-- Simple fix to add user_id column to quotes table
-- Copy and paste this into your Supabase SQL Editor and run it

ALTER TABLE quotes ADD COLUMN user_id UUID REFERENCES auth.users(id);