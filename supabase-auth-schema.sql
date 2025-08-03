-- Add user_id column to quotes table to link quotes to users
ALTER TABLE quotes ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Create index for faster user quote queries
CREATE INDEX idx_quotes_user_id ON quotes(user_id);

-- Update RLS policies for user-specific access
DROP POLICY IF EXISTS "Anyone can view quotes" ON quotes;
DROP POLICY IF EXISTS "Authenticated users can insert quotes" ON quotes;

-- Allow anyone to view all quotes
CREATE POLICY "Anyone can view quotes" ON quotes
    FOR SELECT USING (true);

-- Allow authenticated users to insert quotes (will be linked to their user_id)
CREATE POLICY "Users can insert their own quotes" ON quotes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own quotes
CREATE POLICY "Users can update their own quotes" ON quotes
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own quotes
CREATE POLICY "Users can delete their own quotes" ON quotes
    FOR DELETE USING (auth.uid() = user_id);

-- Update existing quotes to be public (no user_id) so they remain visible
-- This is optional - you can skip this if you want to start fresh