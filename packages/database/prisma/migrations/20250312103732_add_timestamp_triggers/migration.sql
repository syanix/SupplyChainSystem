-- CreateFunction
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to set updatedAt on insert if it's null
CREATE OR REPLACE FUNCTION set_initial_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW."updatedAt" IS NULL THEN
        NEW."updatedAt" = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to all tables with updatedAt column
DO $$
DECLARE
    t record;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updatedAt' 
        AND table_schema = 'public'
    LOOP
        -- Trigger for updates
        EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON %I', t.table_name);
        EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t.table_name);
        
        -- Trigger for inserts
        EXECUTE format('DROP TRIGGER IF EXISTS set_initial_updated_at ON %I', t.table_name);
        EXECUTE format('CREATE TRIGGER set_initial_updated_at BEFORE INSERT ON %I FOR EACH ROW EXECUTE FUNCTION set_initial_updated_at_column()', t.table_name);
    END LOOP;
END;
$$ LANGUAGE plpgsql; 