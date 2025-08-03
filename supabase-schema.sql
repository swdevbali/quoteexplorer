-- Create quotes table
CREATE TABLE quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create an index on author for faster searches
CREATE INDEX idx_quotes_author ON quotes(author);

-- Create an index on category for faster filtering
CREATE INDEX idx_quotes_category ON quotes(category);

-- Enable Row Level Security (RLS)
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read quotes
CREATE POLICY "Anyone can view quotes" ON quotes
    FOR SELECT USING (true);

-- Create a policy that allows authenticated users to insert quotes
CREATE POLICY "Authenticated users can insert quotes" ON quotes
    FOR INSERT WITH CHECK (true);

-- Insert some sample quotes
INSERT INTO quotes (content, author, category) VALUES
    ('The only way to do great work is to love what you do.', 'Steve Jobs', 'motivation'),
    ('Innovation distinguishes between a leader and a follower.', 'Steve Jobs', 'leadership'),
    ('Life is what happens when you''re busy making other plans.', 'John Lennon', 'life'),
    ('The future belongs to those who believe in the beauty of their dreams.', 'Eleanor Roosevelt', 'inspiration'),
    ('It is during our darkest moments that we must focus to see the light.', 'Aristotle', 'wisdom'),
    ('The only impossible journey is the one you never begin.', 'Tony Robbins', 'motivation'),
    ('In the middle of difficulty lies opportunity.', 'Albert Einstein', 'wisdom'),
    ('Success is not final, failure is not fatal: it is the courage to continue that counts.', 'Winston Churchill', 'perseverance');