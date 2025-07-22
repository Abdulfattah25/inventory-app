-- Create storage bucket for attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('attachments', 'attachments', false);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true);

-- Create storage bucket for receipts
INSERT INTO storage.buckets (id, name, public) 
VALUES ('receipts', 'receipts', false);

-- Storage policies for attachments bucket
CREATE POLICY "Users can upload their own attachments" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'attachments' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own attachments" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'attachments' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own attachments" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'attachments' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own attachments" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'attachments' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Storage policies for product-images bucket
CREATE POLICY "Users can upload their own product images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'product-images' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Anyone can view product images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Users can update their own product images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'product-images' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own product images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'product-images' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Storage policies for receipts bucket
CREATE POLICY "Users can upload their own receipts" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'receipts' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own receipts" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'receipts' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own receipts" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'receipts' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own receipts" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'receipts' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );
