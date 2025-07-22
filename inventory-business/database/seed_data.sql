-- Function to create default categories for new users
CREATE OR REPLACE FUNCTION public.create_default_categories_for_user(user_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Default Income Categories
    INSERT INTO public.categories (user_id, name, description, type, color, icon) VALUES
    (user_id, 'Gaji', 'Gaji bulanan atau pendapatan tetap', 'income', '#28a745', 'bi-cash-coin'),
    (user_id, 'Freelance', 'Pendapatan dari pekerjaan freelance', 'income', '#20c997', 'bi-laptop'),
    (user_id, 'Investasi', 'Keuntungan dari investasi', 'income', '#17a2b8', 'bi-graph-up'),
    (user_id, 'Penjualan', 'Pendapatan dari penjualan barang', 'income', '#ffc107', 'bi-shop'),
    (user_id, 'Bonus', 'Bonus atau tunjangan', 'income', '#fd7e14', 'bi-gift'),
        (user_id, 'Lain-lain', 'Pendapatan lainnya', 'income', '#6f42c1', 'bi-plus-circle');

    -- Default Expense Categories
    INSERT INTO public.categories (user_id, name, description, type, color, icon) VALUES
    (user_id, 'Makanan & Minuman', 'Pengeluaran untuk makanan dan minuman', 'expense', '#dc3545', 'bi-cup-straw'),
    (user_id, 'Transportasi', 'Biaya transportasi dan bahan bakar', 'expense', '#fd7e14', 'bi-car-front'),
    (user_id, 'Belanja', 'Belanja kebutuhan sehari-hari', 'expense', '#e83e8c', 'bi-bag-shopping'),
    (user_id, 'Tagihan', 'Listrik, air, internet, telepon', 'expense', '#6f42c1', 'bi-receipt'),
    (user_id, 'Kesehatan', 'Biaya kesehatan dan obat-obatan', 'expense', '#20c997', 'bi-heart-pulse'),
    (user_id, 'Pendidikan', 'Biaya pendidikan dan kursus', 'expense', '#0dcaf0', 'bi-book'),
    (user_id, 'Hiburan', 'Biaya hiburan dan rekreasi', 'expense', '#198754', 'bi-controller'),
    (user_id, 'Investasi', 'Pengeluaran untuk investasi', 'expense', '#0d6efd', 'bi-graph-up-arrow'),
    (user_id, 'Asuransi', 'Premi asuransi', 'expense', '#6c757d', 'bi-shield-check'),
    (user_id, 'Lain-lain', 'Pengeluaran lainnya', 'expense', '#adb5bd', 'bi-three-dots');

    -- Default Products (sample inventory items)
    INSERT INTO public.products (user_id, name, description, sku, unit, cost_price, selling_price, stock_quantity, min_stock_level) VALUES
    (user_id, 'Produk Sample 1', 'Contoh produk untuk inventory', 'SKU001', 'pcs', 10000, 15000, 100, 10),
    (user_id, 'Produk Sample 2', 'Contoh produk untuk inventory', 'SKU002', 'pcs', 25000, 35000, 50, 5);

EXCEPTION
    WHEN unique_violation THEN
        -- Categories already exist for this user, do nothing
        NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically create profile and default data when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile
    INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
    
    -- Create default categories
    PERFORM public.create_default_categories_for_user(NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run when new user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
