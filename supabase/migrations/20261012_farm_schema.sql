-- FarmSync PostgreSQL Database Schema
-- Isolated by farm_id with Row Level Security (RLS)

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('owner', 'manager', 'worker');
CREATE TYPE crop_status AS ENUM ('planted', 'growing', 'harvested', 'fallow');
CREATE TYPE animal_gender AS ENUM ('male', 'female');
CREATE TYPE health_status AS ENUM ('healthy', 'treatment', 'quarantine', 'critical');
CREATE TYPE equipment_status AS ENUM ('active', 'under_maintenance', 'retired');
CREATE TYPE task_priority AS ENUM ('low', 'normal', 'medium', 'high', 'urgent');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'completed');
CREATE TYPE transaction_type AS ENUM ('sale', 'expense');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'on_leave');

-- 3. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FARMS
CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    location TEXT NOT NULL,
    latitude NUMERIC(10, 6) DEFAULT 38.544907,
    longitude NUMERIC(10, 6) DEFAULT -121.740517,
    total_area_acres NUMERIC(10, 2) NOT NULL DEFAULT 450.0,
    soil_type TEXT DEFAULT 'Clay Loam & Sandy Alluvium',
    farm_type TEXT DEFAULT 'Organic Diversified (Crops & Dairy)',
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FARM MEMBERS (Role-Based Access)
CREATE TABLE IF NOT EXISTS farm_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'worker',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(farm_id, user_id)
);

-- 6. CROPS
CREATE TABLE IF NOT EXISTS crops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    variety TEXT,
    field_plot TEXT NOT NULL,
    area_acres NUMERIC(10, 2) NOT NULL,
    planting_date DATE NOT NULL,
    expected_harvest_date DATE NOT NULL,
    status crop_status NOT NULL DEFAULT 'growing',
    estimated_yield NUMERIC(10, 2),
    actual_yield NUMERIC(10, 2),
    yield_unit TEXT DEFAULT 'Tons',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CROP LOGS (Fertilizer, Pesticide, Irrigation, Growth Stage)
CREATE TABLE IF NOT EXISTS crop_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    crop_id UUID NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- 'Fertilizer', 'Pesticide', 'Irrigation', 'Scouting', 'Harvest'
    description TEXT NOT NULL,
    quantity_used NUMERIC(10, 2),
    unit TEXT,
    applied_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. LIVESTOCK
CREATE TABLE IF NOT EXISTS livestock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    tag_id TEXT NOT NULL,
    animal_type TEXT NOT NULL, -- 'Cattle', 'Sheep', 'Goat', 'Swine', 'Poultry'
    breed TEXT NOT NULL,
    age_months INT,
    gender animal_gender NOT NULL,
    health_status health_status NOT NULL DEFAULT 'healthy',
    weight_kg NUMERIC(8, 2),
    pasture_location TEXT,
    feed_schedule TEXT,
    last_vaccination_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(farm_id, tag_id)
);

-- 9. LIVESTOCK HEALTH & VACCINATION RECORDS
CREATE TABLE IF NOT EXISTS livestock_health_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    livestock_id UUID NOT NULL REFERENCES livestock(id) ON DELETE CASCADE,
    record_type TEXT NOT NULL, -- 'Vaccination', 'Checkup', 'Treatment', 'Breeding'
    treatment TEXT NOT NULL,
    dosage TEXT,
    veterinarian TEXT,
    administered_date DATE NOT NULL DEFAULT CURRENT_DATE,
    next_due_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SUPPLIERS
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    products_supplied TEXT[],
    rating NUMERIC(2, 1) DEFAULT 5.0,
    last_order_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. INVENTORY ITEMS
CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Seeds', 'Fertilizers', 'Pesticides', 'Feed', 'Tools', 'Irrigation'
    sku TEXT,
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 0,
    unit TEXT NOT NULL, -- 'Bags', 'Kg', 'Liters', 'Units', 'Tons'
    reorder_level NUMERIC(10, 2) NOT NULL DEFAULT 10,
    unit_cost NUMERIC(10, 2) DEFAULT 0,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    storage_location TEXT,
    expiry_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. STOCK MOVEMENTS (Audit Log for Stock In/Out)
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    movement_type TEXT NOT NULL, -- 'IN', 'OUT', 'ADJUSTMENT'
    quantity NUMERIC(10, 2) NOT NULL,
    reason TEXT,
    performed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. EQUIPMENT & MACHINERY
CREATE TABLE IF NOT EXISTS equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    model TEXT,
    serial_number TEXT,
    status equipment_status NOT NULL DEFAULT 'active',
    purchase_date DATE,
    purchase_cost NUMERIC(12, 2),
    last_service_date DATE,
    next_service_due DATE,
    assigned_operator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. MAINTENANCE LOGS
CREATE TABLE IF NOT EXISTS maintenance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL,
    cost NUMERIC(10, 2) DEFAULT 0,
    serviced_by TEXT,
    service_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. TASKS (Kanban & Assignments)
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status task_status NOT NULL DEFAULT 'todo',
    priority task_priority NOT NULL DEFAULT 'normal',
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    due_date TIMESTAMPTZ,
    related_crop_id UUID REFERENCES crops(id) ON DELETE SET NULL,
    related_livestock_id UUID REFERENCES livestock(id) ON DELETE SET NULL,
    related_plot TEXT,
    progress_percentage INT DEFAULT 0,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. TRANSACTIONS (Sales & Expenses)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    category TEXT NOT NULL, -- 'Crop Sales', 'Livestock Sales', 'Fertilizer', 'Fuel', 'Labor', 'Equipment'
    amount NUMERIC(12, 2) NOT NULL,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method TEXT DEFAULT 'Bank Transfer',
    reference_number TEXT,
    description TEXT,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. ATTENDANCE
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status attendance_status NOT NULL DEFAULT 'present',
    check_in TIMESTAMPTZ,
    check_out TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(farm_id, user_id, date)
);

-- 18. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'low_stock', 'maintenance_due', 'task_assigned', 'vaccination_due', 'weather_alert'
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. ACTIVITY AUDIT LOGS
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    action TEXT NOT NULL,
    module TEXT NOT NULL, -- 'Crops', 'Livestock', 'Inventory', 'Equipment', 'Tasks', 'Finance'
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_crops_farm ON crops(farm_id);
CREATE INDEX IF NOT EXISTS idx_livestock_farm ON livestock(farm_id);
CREATE INDEX IF NOT EXISTS idx_inventory_farm ON inventory_items(farm_id);
CREATE INDEX IF NOT EXISTS idx_equipment_farm ON equipment(farm_id);
CREATE INDEX IF NOT EXISTS idx_tasks_farm ON tasks(farm_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_transactions_farm ON transactions(farm_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_activity_logs_farm ON activity_logs(farm_id);

-- TRIGGER FUNCTION FOR LOW-STOCK NOTIFICATIONS
CREATE OR REPLACE FUNCTION notify_low_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.quantity <= NEW.reorder_level THEN
        INSERT INTO notifications (farm_id, title, message, type, link)
        VALUES (
            NEW.farm_id,
            'Low Inventory Alert: ' || NEW.name,
            NEW.name || ' has fallen to ' || NEW.quantity || ' ' || NEW.unit || ' (Reorder threshold: ' || NEW.reorder_level || ')',
            'low_stock',
            '/inventory'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_low_stock ON inventory_items;
CREATE TRIGGER trg_check_low_stock
AFTER INSERT OR UPDATE OF quantity ON inventory_items
FOR EACH ROW EXECUTE FUNCTION notify_low_stock();

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE livestock ENABLE ROW LEVEL SECURITY;
ALTER TABLE livestock_health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- POLICIES (Users access data belonging to their farm)
CREATE POLICY "Public profiles are readable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Farm members can view their farm data
CREATE POLICY "Farm members view farms" ON farms FOR SELECT
USING (id IN (SELECT farm_id FROM farm_members WHERE user_id = auth.uid()));

CREATE POLICY "Farm members view membership" ON farm_members FOR SELECT
USING (farm_id IN (SELECT farm_id FROM farm_members WHERE user_id = auth.uid()));

-- Dynamic policy creator for farm-isolated tables
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
    AND tablename IN ('crops', 'crop_logs', 'livestock', 'livestock_health_records', 
                     'suppliers', 'inventory_items', 'stock_movements', 'equipment', 
                     'maintenance_logs', 'tasks', 'transactions', 'attendance', 
                     'notifications', 'activity_logs')
    LOOP
        EXECUTE format('
            CREATE POLICY "%I_farm_isolation_select" ON %I FOR SELECT 
            USING (farm_id IN (SELECT farm_id FROM farm_members WHERE user_id = auth.uid()));
            
            CREATE POLICY "%I_farm_isolation_all" ON %I FOR ALL 
            USING (farm_id IN (SELECT farm_id FROM farm_members WHERE user_id = auth.uid()));
        ', tbl, tbl, tbl, tbl);
    END LOOP;
END;
$$;
