-- Function to update product stock when transaction is created/updated
CREATE OR REPLACE FUNCTION public.update_product_stock()
RETURNS TRIGGER AS $$
DECLARE
    stock_change INTEGER;
BEGIN
    -- Only process transactions that have product_id
    IF NEW.product_id IS NOT NULL THEN
        -- Calculate stock change based on transaction type
        IF NEW.type = 'income' THEN
            -- Income transaction increases stock (purchase/restock)
            stock_change := NEW.quantity;
        ELSE
            -- Expense transaction decreases stock (sale)
            stock_change := -NEW.quantity;
        END IF;

        -- Update product stock
        UPDATE public.products 
        SET stock_quantity = stock_quantity + stock_change,
            updated_at = NOW()
        WHERE id = NEW.product_id AND user_id = NEW.user_id;

        -- Create stock movement record
        INSERT INTO public.stock_movements (
            user_id, product_id, transaction_id, type, quantity, 
            unit_cost, total_cost, reason, date
        ) VALUES (
            NEW.user_id, 
            NEW.product_id, 
            NEW.id,
            CASE WHEN NEW.type = 'income' THEN 'in' ELSE 'out' END,
            NEW.quantity,
            NEW.amount / NEW.quantity,
            NEW.amount,
            CASE WHEN NEW.type = 'income' THEN 'Purchase' ELSE 'Sale' END,
            NEW.date
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle stock when transaction is updated
CREATE OR REPLACE FUNCTION public.handle_transaction_stock_update()
RETURNS TRIGGER AS $$
DECLARE
    old_stock_change INTEGER;
    new_stock_change INTEGER;
    net_change INTEGER;
BEGIN
    -- Only process if product_id changed or quantity changed
    IF OLD.product_id IS DISTINCT FROM NEW.product_id OR 
       OLD.quantity IS DISTINCT FROM NEW.quantity OR
       OLD.type IS DISTINCT FROM NEW.type THEN
        
        -- Reverse old stock change
        IF OLD.product_id IS NOT NULL THEN
            IF OLD.type = 'income' THEN
                old_stock_change := -OLD.quantity; -- Reverse the increase
            ELSE
                old_stock_change := OLD.quantity; -- Reverse the decrease
            END IF;
            
            UPDATE public.products 
            SET stock_quantity = stock_quantity + old_stock_change,
                updated_at = NOW()
            WHERE id = OLD.product_id AND user_id = OLD.user_id;
        END IF;

        -- Apply new stock change
        IF NEW.product_id IS NOT NULL THEN
            IF NEW.type = 'income' THEN
                new_stock_change := NEW.quantity;
            ELSE
                new_stock_change := -NEW.quantity;
            END IF;
            
            UPDATE public.products 
            SET stock_quantity = stock_quantity + new_stock_change,
                updated_at = NOW()
            WHERE id = NEW.product_id AND user_id = NEW.user_id;
        END IF;

        -- Update stock movement record
        UPDATE public.stock_movements 
        SET type = CASE WHEN NEW.type = 'income' THEN 'in' ELSE 'out' END,
            quantity = NEW.quantity,
            unit_cost = NEW.amount / NEW.quantity,
            total_cost = NEW.amount,
            date = NEW.date
        WHERE transaction_id = NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle stock when transaction is deleted
CREATE OR REPLACE FUNCTION public.handle_transaction_stock_delete()
RETURNS TRIGGER AS $$
DECLARE
    stock_change INTEGER;
BEGIN
    -- Only process transactions that have product_id
    IF OLD.product_id IS NOT NULL THEN
        -- Reverse the stock change
        IF OLD.type = 'income' THEN
            stock_change := -OLD.quantity; -- Reverse the increase
        ELSE
            stock_change := OLD.quantity; -- Reverse the decrease
        END IF;

        -- Update product stock
        UPDATE public.products 
        SET stock_quantity = stock_quantity + stock_change,
            updated_at = NOW()
        WHERE id = OLD.product_id AND user_id = OLD.user_id;

        -- Delete stock movement record
        DELETE FROM public.stock_movements 
        WHERE transaction_id = OLD.id;
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for stock management
CREATE TRIGGER transaction_stock_insert
    AFTER INSERT ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION public.update_product_stock();

CREATE TRIGGER transaction_stock_update
    AFTER UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION public.handle_transaction_stock_update();

CREATE TRIGGER transaction_stock_delete
    AFTER DELETE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION public.handle_transaction_stock_delete();

-- Function to get user dashboard summary
CREATE OR REPLACE FUNCTION public.get_dashboard_summary(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_income', COALESCE(income.total, 0),
        'total_expense', COALESCE(expense.total, 0),
        'balance', COALESCE(income.total, 0) - COALESCE(expense.total, 0),
        'transaction_count', COALESCE(income.count, 0) + COALESCE(expense.count, 0),
        'categories_count', (SELECT COUNT(*) FROM public.categories WHERE user_id = p_user_id AND is_active = true),
        'products_count', (SELECT COUNT(*) FROM public.products WHERE user_id = p_user_id AND is_active = true),
        'low_stock_products', (
            SELECT COUNT(*) 
            FROM public.products 
            WHERE user_id = p_user_id 
            AND is_active = true 
            AND stock_quantity <= min_stock_level
        )
    ) INTO result
    FROM (
        SELECT SUM(amount) as total, COUNT(*) as count
        FROM public.transactions 
        WHERE user_id = p_user_id AND type = 'income'
    ) income
    FULL OUTER JOIN (
        SELECT SUM(amount) as total, COUNT(*) as count
        FROM public.transactions 
        WHERE user_id = p_user_id AND type = 'expense'
    ) expense ON true;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create recurring transactions
CREATE OR REPLACE FUNCTION public.create_due_recurring_transactions()
RETURNS INTEGER AS $$
DECLARE
    rec RECORD;
    created_count INTEGER := 0;
    next_date DATE;
BEGIN
    FOR rec IN 
        SELECT * FROM public.recurring_transactions 
        WHERE is_active = true 
        AND next_date <= CURRENT_DATE
        AND (end_date IS NULL OR next_date <= end_date)
    LOOP
        -- Create the transaction
        INSERT INTO public.transactions (
            user_id, category_id, type, amount, description, 
            date, is_recurring
        ) VALUES (
            rec.user_id, rec.category_id, rec.type, rec.amount, 
            rec.description, rec.next_date, true
        );
        
        -- Calculate next date
        CASE rec.frequency
            WHEN 'daily' THEN next_date := rec.next_date + INTERVAL '1 day';
            WHEN 'weekly' THEN next_date := rec.next_date + INTERVAL '1 week';
                        WHEN 'monthly' THEN next_date := rec.next_date + INTERVAL '1 month';
            WHEN 'yearly' THEN next_date := rec.next_date + INTERVAL '1 year';
            ELSE next_date := rec.next_date + INTERVAL '1 month';
        END CASE;
        
        -- Update next_date or deactivate if past end_date
        IF rec.end_date IS NULL OR next_date <= rec.end_date THEN
            UPDATE public.recurring_transactions 
            SET next_date = next_date
            WHERE id = rec.id;
        ELSE
            UPDATE public.recurring_transactions 
            SET is_active = false
            WHERE id = rec.id;
        END IF;
        
        created_count := created_count + 1;
    END LOOP;
    
    RETURN created_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

