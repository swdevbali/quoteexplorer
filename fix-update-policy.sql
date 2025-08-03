-- Fix update policy for quotes
-- Run this in Supabase SQL Editor

-- Drop existing update policy
DROP POLICY IF EXISTS "Users can update their own quotes" ON quotes;

-- Create a more permissive update policy for debugging
CREATE POLICY "Users can update their own quotes" ON quotes
    FOR UPDATE USING (
        auth.uid() IS NOT NULL AND 
        (user_id = auth.uid() OR user_id IS NULL)
    );

-- Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'quotes';