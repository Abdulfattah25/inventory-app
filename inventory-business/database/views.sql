-- View for transaction summary by category
CREATE OR REPLACE VIEW public.transaction_summary_by_category AS
SELECT 
    t.user_id,
    c.id as category_id,
    c.name as category_name,
    c.type as category_type,
    c.color as category_color,
    COUNT(t.id) as transaction_count,
    SUM(t.amount) as total_amount,
    AVG(t.amount) as average_amount,
    MIN(t.date) as first_transaction_date,
    MAX(t.date) as last_transaction_date
FROM public.transactions t
LEFT JOIN public.categories c ON t.category_id = c.id
GROUP BY t.user_id, c.id, c.name, c.type, c.color;

-- View for monthly transaction summary
CREATE OR REPLACE VIEW public.monthly_transaction_summary AS
SELECT 
    user_id,
    DATE_TRUNC('month', date) as month,
    type,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount,
    AVG(amount) as average_amount
FROM public.transactions
GROUP BY user_id, DATE_TRUNC('month', date), type
ORDER BY month DESC, type;

-- View for product stock status
CREATE OR REPLACE VIEW public.product_stock_status AS
SELECT 
    p.*,
    CASE 
        WHEN p.stock_quantity <= 0 THEN 'out_of_stock'
        WHEN p.stock_quantity <= p.min_stock_level THEN 'low_stock'
        WHEN p.max_stock_level IS NOT NULL AND p.stock_quantity >= p.max_stock_level THEN 'overstock'
        ELSE 'normal'
    END as stock_status,
    COALESCE(sm.total_in, 0) as total_stock_in,
    COALESCE(sm.total_out, 0) as total_stock_out
FROM public.products p
LEFT JOIN (
    SELECT 
        product_id,
        SUM(CASE WHEN type = 'in' THEN quantity ELSE 0 END) as total_in,
        SUM(CASE WHEN type = 'out' THEN quantity ELSE 0 END) as total_out
    FROM public.stock_movements
    GROUP BY product_id
) sm ON p.id = sm.product_id;

-- View for budget vs actual spending
CREATE OR REPLACE VIEW public.budget_vs_actual AS
SELECT 
    b.*,
    COALESCE(t.actual_amount, 0) as actual_amount,
    COALESCE(t.transaction_count, 0) as transaction_count,
    CASE 
        WHEN b.amount > 0 THEN (COALESCE(t.actual_amount, 0) / b.amount * 100)
        ELSE 0
    END as usage_percentage,
    (b.amount - COALESCE(t.actual_amount, 0)) as remaining_amount
FROM public.budgets b
LEFT JOIN (
    SELECT 
        user_id,
        category_id,
        SUM(amount) as actual_amount,
        COUNT(*) as transaction_count
    FROM public.transactions
    WHERE type = 'expense'
    GROUP BY user_id, category_id
) t ON b.user_id = t.user_id AND b.category_id = t.category_id
WHERE b.is_active = true;

-- View for cash flow summary
CREATE OR REPLACE VIEW public.cash_flow_summary AS
SELECT 
    user_id,
    DATE_TRUNC('month', date) as month,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
    SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as net_flow,
    COUNT(CASE WHEN type = 'income' THEN 1 END) as income_transactions,
    COUNT(CASE WHEN type = 'expense' THEN 1 END) as expense_transactions
FROM public.transactions
GROUP BY user_id, DATE_TRUNC('month', date)
ORDER BY month DESC;
