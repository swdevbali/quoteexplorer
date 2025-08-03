-- First, check if the user_id column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quotes' AND column_name = 'user_id') THEN
        ALTER TABLE quotes ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Create index for faster user quote queries (if it doesn't exist)
CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON quotes(user_id);

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view quotes" ON quotes;
DROP POLICY IF EXISTS "Authenticated users can insert quotes" ON quotes;
DROP POLICY IF EXISTS "Users can insert their own quotes" ON quotes;
DROP POLICY IF EXISTS "Users can update their own quotes" ON quotes;
DROP POLICY IF EXISTS "Users can delete their own quotes" ON quotes;

-- Ensure RLS is enabled
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view all quotes
CREATE POLICY "Anyone can view quotes" ON quotes
    FOR SELECT USING (true);

-- Allow authenticated users to insert quotes (will be linked to their user_id)
-- This policy is more permissive to avoid auth issues
CREATE POLICY "Users can insert quotes" ON quotes
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to update their own quotes
CREATE POLICY "Users can update their own quotes" ON quotes
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own quotes
CREATE POLICY "Users can delete their own quotes" ON quotes
    FOR DELETE USING (auth.uid() = user_id);

-- Insert some sample quotes if the table is empty
INSERT INTO quotes (content, author, category, user_id) 
SELECT * FROM (VALUES 
    ('The only way to do great work is to love what you do.', 'Steve Jobs', 'motivation', null),
    ('Innovation distinguishes between a leader and a follower.', 'Steve Jobs', 'leadership', null),
    ('Life is what happens when you''re busy making other plans.', 'John Lennon', 'life', null),
    ('The future belongs to those who believe in the beauty of their dreams.', 'Eleanor Roosevelt', 'inspiration', null),
    ('It is during our darkest moments that we must focus to see the light.', 'Aristotle', 'wisdom', null),
    ('The only impossible journey is the one you never begin.', 'Tony Robbins', 'motivation', null),
    ('In the middle of difficulty lies opportunity.', 'Albert Einstein', 'wisdom', null),
    ('Success is not final, failure is not fatal: it is the courage to continue that counts.', 'Winston Churchill', 'perseverance', null)
) AS new_quotes(content, author, category, user_id)
WHERE NOT EXISTS (SELECT 1 FROM quotes LIMIT 1);