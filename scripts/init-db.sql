-- Initialize the Supply Chain Management System database

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS "public";

-- Set default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;

-- Create audit log table
CREATE TABLE IF NOT EXISTS "public"."audit_logs" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "action" TEXT NOT NULL,
  "entity_type" TEXT NOT NULL,
  "entity_id" TEXT NOT NULL,
  "details" JSONB,
  "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function for tenant isolation
CREATE OR REPLACE FUNCTION check_tenant_id()
RETURNS TRIGGER AS $$
DECLARE
  current_tenant_id UUID;
BEGIN
  -- Get current tenant ID from session variable
  current_tenant_id := current_setting('app.current_tenant_id', TRUE);
  
  -- Skip check if no tenant ID is set (system operations)
  IF current_tenant_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Ensure tenant_id matches current tenant
  IF NEW.tenant_id::TEXT != current_tenant_id THEN
    RAISE EXCEPTION 'tenant_id does not match current tenant';
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function for creating audit logs
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
DECLARE
  current_user_id UUID;
  current_tenant_id UUID;
  action_type TEXT;
  entity_details JSONB;
BEGIN
  -- Get current user and tenant IDs from session variables
  current_user_id := current_setting('app.current_user_id', TRUE);
  current_tenant_id := current_setting('app.current_tenant_id', TRUE);
  
  -- Skip audit if no user ID is set (system operations)
  IF current_user_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    action_type := 'CREATE';
    entity_details := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'UPDATE';
    entity_details := jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW));
  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'DELETE';
    entity_details := to_jsonb(OLD);
  END IF;
  
  -- Insert audit log
  INSERT INTO "public"."audit_logs" (
    "tenant_id",
    "user_id",
    "action",
    "entity_type",
    "entity_id",
    "details"
  ) VALUES (
    current_tenant_id,
    current_user_id,
    action_type,
    TG_TABLE_NAME,
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.id::TEXT
      ELSE NEW.id::TEXT
    END,
    entity_details
  );
  
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Create indexes on audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON "public"."audit_logs" ("tenant_id");
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON "public"."audit_logs" ("user_id");
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON "public"."audit_logs" ("entity_type");
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_id ON "public"."audit_logs" ("entity_id");
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON "public"."audit_logs" ("created_at");

-- Ensure tenants table has isActive column
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_name = 'tenants'
    ) AND NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'tenants' 
        AND column_name = 'isActive'
    ) THEN
        ALTER TABLE tenants ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT TRUE;
        RAISE NOTICE 'Added isActive column to tenants table';
    END IF;
END $$;

-- Note: The actual tables will be created by Prisma migrations
-- This script only sets up the necessary extensions, functions, and audit logging 