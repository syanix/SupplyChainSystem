-- SQL Seed Script for Supply Chain System
-- This script can be run directly on the production database when Prisma seed isn't working

-- PostgreSQL seed script using PL/pgSQL
DO $$
DECLARE
  tenant_id1 UUID;
  tenant_id2 UUID;
  tenant_id3 UUID;
  supplier_id1 UUID;
  supplier_id2 UUID;
  supplier_id3 UUID;
  product_id1 UUID;
  product_id2 UUID;
  product_id3 UUID;
  product_id4 UUID;
  product_id5 UUID;
  product_id6 UUID;
  user_id1 UUID;
  user_id2 UUID;
  user_id3 UUID;
  order_id1 UUID;
  order_id2 UUID;
  order_id3 UUID;
BEGIN
  -- Set the schema
  SET search_path TO supply_chain;

  -- Create tenants
  -- Tenant 1: Default Company
  INSERT INTO supply_chain.tenants (id, name, slug, description, "isActive", "createdAt", "updatedAt")
  VALUES (
    gen_random_uuid(), 
    'Default Company', 
    'default-company', 
    'Default company for development', 
    true, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  ) RETURNING id INTO tenant_id1;

  RAISE NOTICE 'Created tenant 1 with ID: %', tenant_id1;

  -- Tenant 2: Tech Solutions
  INSERT INTO supply_chain.tenants (id, name, slug, description, "isActive", "createdAt", "updatedAt")
  VALUES (
    gen_random_uuid(), 
    'Tech Solutions', 
    'tech-solutions', 
    'Technology solutions provider', 
    true, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  ) RETURNING id INTO tenant_id2;

  RAISE NOTICE 'Created tenant 2 with ID: %', tenant_id2;

  -- Tenant 3: Global Manufacturing
  INSERT INTO supply_chain.tenants (id, name, slug, description, "isActive", "createdAt", "updatedAt")
  VALUES (
    gen_random_uuid(), 
    'Global Manufacturing', 
    'global-manufacturing', 
    'International manufacturing company', 
    true, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  ) RETURNING id INTO tenant_id3;

  RAISE NOTICE 'Created tenant 3 with ID: %', tenant_id3;

  -- Create users
  -- User 1: Super Admin for Default Company
  INSERT INTO supply_chain.users (id, email, name, password, role, "tenantId", "isActive", "createdAt", "updatedAt")
  VALUES (
    gen_random_uuid(), 
    'admin@example.com', 
    'System Administrator', 
    '$2b$10$rQEL5hPsJNXdm/0eAeIYZu8iGV4a0plqXgP.CRNPXf9DIpZhX1Ugu', -- bcrypt hash for 'Admin123!'
    'SUPER_ADMIN', 
    tenant_id1, 
    true, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  ) RETURNING id INTO user_id1;

  RAISE NOTICE 'Created super admin user with ID: %', user_id1;

  -- User 2: Admin for Tech Solutions
  INSERT INTO supply_chain.users (id, email, name, password, role, "tenantId", "isActive", "createdAt", "updatedAt")
  VALUES (
    gen_random_uuid(), 
    'admin@techsolutions.com', 
    'Tech Admin', 
    '$2b$10$rQEL5hPsJNXdm/0eAeIYZu8iGV4a0plqXgP.CRNPXf9DIpZhX1Ugu', -- bcrypt hash for 'Admin123!'
    'ADMIN', 
    tenant_id2, 
    true, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  ) RETURNING id INTO user_id2;

  RAISE NOTICE 'Created admin user with ID: %', user_id2;

  -- User 3: Manager for Global Manufacturing
  INSERT INTO supply_chain.users (id, email, name, password, role, "tenantId", "isActive", "createdAt", "updatedAt")
  VALUES (
    gen_random_uuid(), 
    'manager@globalmanufacturing.com', 
    'Global Manager', 
    '$2b$10$rQEL5hPsJNXdm/0eAeIYZu8iGV4a0plqXgP.CRNPXf9DIpZhX1Ugu', -- bcrypt hash for 'Admin123!'
    'MANAGER', 
    tenant_id3, 
    true, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  ) RETURNING id INTO user_id3;

  RAISE NOTICE 'Created manager user with ID: %', user_id3;

  -- Create suppliers
  -- Supplier 1: ABC Supplies for Default Company
  INSERT INTO supply_chain.suppliers (
    id, name, description, email, phone, address, city, state, country, 
    status, "tenantId", "createdAt", "updatedAt"
  )
  VALUES (
    gen_random_uuid(), 
    'ABC Supplies', 
    'General supplies provider', 
    'contact@abcsupplies.com', 
    '123-456-7890', 
    '123 Main St', 
    'Anytown', 
    'CA', 
    'USA', 
    'ACTIVE', 
    tenant_id1, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  ) RETURNING id INTO supplier_id1;

  RAISE NOTICE 'Created supplier 1 with ID: %', supplier_id1;

  -- Supplier 2: Tech Components for Tech Solutions
  INSERT INTO supply_chain.suppliers (
    id, name, description, email, phone, address, city, state, country, 
    status, "tenantId", "createdAt", "updatedAt"
  )
  VALUES (
    gen_random_uuid(), 
    'Tech Components', 
    'Electronic components supplier', 
    'sales@techcomponents.com', 
    '555-123-4567', 
    '456 Tech Blvd', 
    'Silicon Valley', 
    'CA', 
    'USA', 
    'ACTIVE', 
    tenant_id2, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  ) RETURNING id INTO supplier_id2;

  RAISE NOTICE 'Created supplier 2 with ID: %', supplier_id2;

  -- Supplier 3: Global Materials for Global Manufacturing
  INSERT INTO supply_chain.suppliers (
    id, name, description, email, phone, address, city, state, country, 
    status, "tenantId", "createdAt", "updatedAt"
  )
  VALUES (
    gen_random_uuid(), 
    'Global Materials', 
    'Raw materials supplier', 
    'info@globalmaterials.com', 
    '+44 20 1234 5678', 
    '789 Industrial Way', 
    'London', 
    'Greater London', 
    'UK', 
    'ACTIVE', 
    tenant_id3, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  ) RETURNING id INTO supplier_id3;

  RAISE NOTICE 'Created supplier 3 with ID: %', supplier_id3;

  -- Create supplier contacts
  -- Contact for Supplier 1
  INSERT INTO supply_chain.supplier_contacts (
    id, name, position, email, phone, "isPrimary", "supplierId", "createdAt", "updatedAt"
  )
  VALUES (
    gen_random_uuid(), 
    'John Doe', 
    'Sales Manager', 
    'john@abcsupplies.com', 
    '123-456-7890', 
    true, 
    supplier_id1, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  );

  -- Contact for Supplier 2
  INSERT INTO supply_chain.supplier_contacts (
    id, name, position, email, phone, "isPrimary", "supplierId", "createdAt", "updatedAt"
  )
  VALUES (
    gen_random_uuid(), 
    'Jane Smith', 
    'Account Executive', 
    'jane@techcomponents.com', 
    '555-987-6543', 
    true, 
    supplier_id2, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  );

  -- Contact for Supplier 3
  INSERT INTO supply_chain.supplier_contacts (
    id, name, position, email, phone, "isPrimary", "supplierId", "createdAt", "updatedAt"
  )
  VALUES (
    gen_random_uuid(), 
    'Robert Johnson', 
    'International Sales Director', 
    'robert@globalmaterials.com', 
    '+44 20 8765 4321', 
    true, 
    supplier_id3, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  );

  RAISE NOTICE 'Created supplier contacts';

  -- Create products
  -- Products for Supplier 1 (ABC Supplies)
  INSERT INTO supply_chain.products (
    id, name, description, price, cost, "stockQuantity", sku, 
    category, "supplierId", "tenantId", "createdAt", "updatedAt"
  )
  VALUES (
    gen_random_uuid(), 
    'Office Chair', 
    'Ergonomic office chair with lumbar support', 
    199.99, 
    120.0, 
    50, 
    'SKU-001', 
    'Office Furniture', 
    supplier_id1, 
    tenant_id1, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  ) RETURNING id INTO product_id1;

  INSERT INTO supply_chain.products (
    id, name, description, price, cost, "stockQuantity", sku, 
    category, "supplierId", "tenantId", "createdAt", "updatedAt"
  )
  VALUES (
    gen_random_uuid(), 
    'Desk Lamp', 
    'LED desk lamp with adjustable brightness', 
    49.99, 
    25.0, 
    100, 
    'SKU-002', 
    'Office Accessories', 
    supplier_id1, 
    tenant_id1, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  ) RETURNING id INTO product_id2;

  -- Products for Supplier 2 (Tech Components)
  INSERT INTO supply_chain.products (
    id, name, description, price, cost, "stockQuantity", sku, 
    category, "supplierId", "tenantId", "createdAt", "updatedAt"
  )
  VALUES (
    gen_random_uuid(), 
    'CPU Processor', 
    'High-performance CPU for workstations', 
    399.99, 
    280.0, 
    30, 
    'TC-001', 
    'Computer Components', 
    supplier_id2, 
    tenant_id2, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  ) RETURNING id INTO product_id3;

  INSERT INTO supply_chain.products (
    id, name, description, price, cost, "stockQuantity", sku, 
    category, "supplierId", "tenantId", "createdAt", "updatedAt"
  )
  VALUES (
    gen_random_uuid(), 
    'Graphics Card', 
    'High-end graphics card for gaming and rendering', 
    699.99, 
    550.0, 
    20, 
    'TC-002', 
    'Computer Components', 
    supplier_id2, 
    tenant_id2, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  ) RETURNING id INTO product_id4;

  -- Products for Supplier 3 (Global Materials)
  INSERT INTO supply_chain.products (
    id, name, description, price, cost, "stockQuantity", sku, 
    category, "supplierId", "tenantId", "createdAt", "updatedAt"
  )
  VALUES (
    gen_random_uuid(), 
    'Aluminum Sheet', 
    'Industrial grade aluminum sheet, 2mm thickness', 
    89.99, 
    60.0, 
    200, 
    'GM-001', 
    'Raw Materials', 
    supplier_id3, 
    tenant_id3, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  ) RETURNING id INTO product_id5;

  INSERT INTO supply_chain.products (
    id, name, description, price, cost, "stockQuantity", sku, 
    category, "supplierId", "tenantId", "createdAt", "updatedAt"
  )
  VALUES (
    gen_random_uuid(), 
    'Steel Pipe', 
    'Galvanized steel pipe, 1-inch diameter', 
    129.99, 
    85.0, 
    150, 
    'GM-002', 
    'Raw Materials', 
    supplier_id3, 
    tenant_id3, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  ) RETURNING id INTO product_id6;

  RAISE NOTICE 'Created products';

  -- Create orders
  -- Order 1 for Default Company
  INSERT INTO supply_chain.orders (
    id, "orderNumber", status, "orderDate", "expectedDeliveryDate", 
    "shippingAddress", subtotal, "taxAmount", "shippingCost", "totalAmount", 
    "paymentMethod", "paymentStatus", "supplierId", "userId", "tenantId", 
    "createdAt", "updatedAt"
  )
  VALUES (
    gen_random_uuid(), 
    'ORD-2023-001', 
    'CONFIRMED', 
    CURRENT_TIMESTAMP - INTERVAL '7 days', 
    CURRENT_TIMESTAMP + INTERVAL '7 days', 
    '123 Corporate HQ, Anytown, CA, USA', 
    249.98, 
    20.00, 
    15.00, 
    284.98, 
    'CREDIT_CARD', 
    'PAID', 
    supplier_id1, 
    user_id1, 
    tenant_id1, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  ) RETURNING id INTO order_id1;

  -- Order items for Order 1
  INSERT INTO supply_chain.order_items (
    id, "orderId", "productId", quantity, "unitPrice", "totalPrice", 
    sku, "productName", "createdAt", "updatedAt"
  )
  VALUES (
    gen_random_uuid(), 
    order_id1, 
    product_id1, 
    1, 
    199.99, 
    199.99, 
    'SKU-001', 
    'Office Chair', 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  );

  INSERT INTO supply_chain.order_items (
    id, "orderId", "productId", quantity, "unitPrice", "totalPrice", 
    sku, "productName", "createdAt", "updatedAt"
  )
  VALUES (
    gen_random_uuid(), 
    order_id1, 
    product_id2, 
    1, 
    49.99, 
    49.99, 
    'SKU-002', 
    'Desk Lamp', 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  );

  -- Order 2 for Tech Solutions
  INSERT INTO supply_chain.orders (
    id, "orderNumber", status, "orderDate", "expectedDeliveryDate", 
    "shippingAddress", subtotal, "taxAmount", "shippingCost", "totalAmount", 
    "paymentMethod", "paymentStatus", "supplierId", "userId", "tenantId", 
    "createdAt", "updatedAt"
  )
  VALUES (
    gen_random_uuid(), 
    'ORD-2023-002', 
    'SHIPPED', 
    CURRENT_TIMESTAMP - INTERVAL '14 days', 
    CURRENT_TIMESTAMP + INTERVAL '3 days', 
    '456 Tech Blvd, Silicon Valley, CA, USA', 
    2099.95, 
    168.00, 
    0.00, 
    2267.95, 
    'BANK_TRANSFER', 
    'PAID', 
    supplier_id2, 
    user_id2, 
    tenant_id2, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  ) RETURNING id INTO order_id2;

  -- Order items for Order 2
  INSERT INTO supply_chain.order_items (
    id, "orderId", "productId", quantity, "unitPrice", "totalPrice", 
    sku, "productName", "createdAt", "updatedAt"
  )
  VALUES (
    gen_random_uuid(), 
    order_id2, 
    product_id3, 
    3, 
    399.99, 
    1199.97, 
    'TC-001', 
    'CPU Processor', 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  );

  INSERT INTO supply_chain.order_items (
    id, "orderId", "productId", quantity, "unitPrice", "totalPrice", 
    sku, "productName", "createdAt", "updatedAt"
  )
  VALUES (
    gen_random_uuid(), 
    order_id2, 
    product_id4, 
    1, 
    699.99, 
    699.99, 
    'TC-002', 
    'Graphics Card', 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  );

  -- Order 3 for Global Manufacturing
  INSERT INTO supply_chain.orders (
    id, "orderNumber", status, "orderDate", "expectedDeliveryDate", 
    "shippingAddress", subtotal, "taxAmount", "shippingCost", "totalAmount", 
    "paymentMethod", "paymentStatus", "supplierId", "userId", "tenantId", 
    "createdAt", "updatedAt"
  )
  VALUES (
    gen_random_uuid(), 
    'ORD-2023-003', 
    'PENDING', 
    CURRENT_TIMESTAMP - INTERVAL '2 days', 
    CURRENT_TIMESTAMP + INTERVAL '14 days', 
    '789 Industrial Way, London, UK', 
    12998.50, 
    2599.70, 
    500.00, 
    16098.20, 
    'INVOICE', 
    'PENDING', 
    supplier_id3, 
    user_id3, 
    tenant_id3, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  ) RETURNING id INTO order_id3;

  -- Order items for Order 3
  INSERT INTO supply_chain.order_items (
    id, "orderId", "productId", quantity, "unitPrice", "totalPrice", 
    sku, "productName", "createdAt", "updatedAt"
  )
  VALUES (
    gen_random_uuid(), 
    order_id3, 
    product_id5, 
    50, 
    89.99, 
    4499.50, 
    'GM-001', 
    'Aluminum Sheet', 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  );

  INSERT INTO supply_chain.order_items (
    id, "orderId", "productId", quantity, "unitPrice", "totalPrice", 
    sku, "productName", "createdAt", "updatedAt"
  )
  VALUES (
    gen_random_uuid(), 
    order_id3, 
    product_id6, 
    65, 
    129.99, 
    8449.35, 
    'GM-002', 
    'Steel Pipe', 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  );

  RAISE NOTICE 'Created orders and order items';
  RAISE NOTICE 'Database seeding completed successfully!';
END $$; 