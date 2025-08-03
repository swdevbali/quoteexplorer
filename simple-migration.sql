-- Simple migration to add user_id column
-- Run this in your Supabase SQL Editor

-- Add the user_id column
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON quotes(user_id);

-- Check if the column was added successfully
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'quotes' 
ORDER BY ordinal_position;