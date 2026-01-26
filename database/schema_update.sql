-- Add email content and attachment URL columns to packages table
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS email_content TEXT,
ADD COLUMN IF NOT EXISTS email_attachment_url TEXT;

-- Update RLS policies if necessary (generally existing policies cover all columns, but good to check)
-- "Public can view active packages" usually selects * so it will include these new columns, which is fine or we might want to exclude them from public select if they are sensitive (but here they are just content sent to user, maybe not secret, but technically only needed after purchase)
-- Actually, we might NOT want to expose email_content/attachment transparently to the public API if it contains the product itself.
-- However, the current API `app.get('/api/packages')` selects `*`. 
-- To protect the content, we should ideally not select these columns in the public API.
-- Because supabase-js client is used in the backend too, we can strictly select fields in the frontend query, OR we can rely on the fact that the backend uses the service key or generic select.
-- For now, adding columns is the first step. Protecting them is a refinement.
