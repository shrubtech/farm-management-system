-- FarmSync Realistic Seed Data
-- Farm: Oakridge Organic Farm (450 Acres)
-- Matches screenshot metrics:
-- Revenue: $54,820, OPEX: $21,390, Net Profit: $33,430
-- Active Crops: 14 Varieties across 450 Acres (Corn 35%, Soybeans 25%, Wheat 20%, Cover Crops 12%, Specialty Greens 8%)
-- Livestock: 342 Heads
-- Low stock: Drip Irrigation Fittings, Urea 46%

-- Demo Farm ID & User IDs
DO $$
DECLARE
    farm_uuid UUID := 'a0000000-0000-0000-0000-000000000001';
    owner_uuid UUID := 'b0000000-0000-0000-0000-000000000001'; -- Thomas Clark (Owner)
    manager_uuid UUID := 'b0000000-0000-0000-0000-000000000002'; -- Sarah Jenkins (Manager)
    worker_uuid UUID := 'b0000000-0000-0000-0000-000000000003'; -- Marcus Johnson (Worker)
    worker2_uuid UUID := 'b0000000-0000-0000-0000-000000000004'; -- Amy Lewis (Worker)
    supplier_agg_uuid UUID := 'c0000000-0000-0000-0000-000000000001';
    supplier_irr_uuid UUID := 'c0000000-0000-0000-0000-000000000002';
    crop_corn_uuid UUID := 'd0000000-0000-0000-0000-000000000001';
    crop_soy_uuid UUID := 'd0000000-0000-0000-0000-000000000002';
    crop_wheat_uuid UUID := 'd0000000-0000-0000-0000-000000000003';
    crop_cover_uuid UUID := 'd0000000-0000-0000-0000-000000000004';
    crop_greens_uuid UUID := 'd0000000-0000-0000-0000-000000000005';
    equip_tractor_uuid UUID := 'e0000000-0000-0000-0000-000000000001';
BEGIN
    -- 1. Profiles
    INSERT INTO profiles (id, full_name, email, phone, avatar_url)
    VALUES
        (owner_uuid, 'Thomas Clark', 'owner@farmsync.io', '+1 (555) 019-2831', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
        (manager_uuid, 'Sarah Jenkins', 'manager@farmsync.io', '+1 (555) 014-9923', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
        (worker_uuid, 'Marcus Johnson', 'worker@farmsync.io', '+1 (555) 018-7744', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'),
        (worker2_uuid, 'Amy Lewis', 'amy@farmsync.io', '+1 (555) 012-3490', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150')
    ON CONFLICT (id) DO NOTHING;

    -- 2. Farm
    INSERT INTO farms (id, name, owner_id, location, latitude, longitude, total_area_acres, soil_type, farm_type)
    VALUES (
        farm_uuid,
        'Oakridge Organic Farm',
        owner_uuid,
        'Oakridge Center, Central Valley, CA',
        38.544907,
        -121.740517,
        450.00,
        'Clay Loam & Sandy Alluvium (Rich Organic)',
        'Organic Diversified (Crops & Dairy)'
    ) ON CONFLICT (id) DO NOTHING;

    -- 3. Farm Members
    INSERT INTO farm_members (farm_id, user_id, role)
    VALUES
        (farm_uuid, owner_uuid, 'owner'),
        (farm_uuid, manager_uuid, 'manager'),
        (farm_uuid, worker_uuid, 'worker'),
        (farm_uuid, worker2_uuid, 'worker')
    ON CONFLICT (farm_id, user_id) DO NOTHING;

    -- 4. Suppliers
    INSERT INTO suppliers (id, farm_id, name, contact_person, email, phone, products_supplied, rating, last_order_date)
    VALUES
        (supplier_agg_uuid, farm_uuid, 'Valley Agritech Supplies', 'Robert Vance', 'sales@valleyagritech.com', '+1 (555) 234-5678', ARRAY['Organic Fertilizer', 'Certified Non-GMO Seeds'], 4.9, '2026-06-01'),
        (supplier_irr_uuid, farm_uuid, 'Pacific Drip & Irrigation', 'Elena Rostova', 'support@pacificdrip.com', '+1 (555) 876-5432', ARRAY['Drip Lines', 'Sensors', 'Pivot Spares'], 4.7, '2026-05-20')
    ON CONFLICT (id) DO NOTHING;

    -- 5. Crops (Total: 450 Acres matching Crop Distribution chart)
    INSERT INTO crops (id, farm_id, name, variety, field_plot, area_acres, planting_date, expected_harvest_date, status, estimated_yield, actual_yield, yield_unit)
    VALUES
        (crop_corn_uuid, farm_uuid, 'Corn', 'Golden Bantam Sweet Corn', 'Plot B-2 & B-3', 158.00, '2026-03-15', '2026-07-20', 'growing', 420.00, NULL, 'Tons'),
        (crop_soy_uuid, farm_uuid, 'Soybeans', 'High-Protein Organic Non-GMO', 'Field East 1-4', 112.00, '2026-04-01', '2026-08-15', 'growing', 280.00, NULL, 'Tons'),
        (crop_wheat_uuid, farm_uuid, 'Wheat', 'Hard Red Winter Wheat', 'Field North 7', 90.00, '2025-11-10', '2026-06-30', 'growing', 210.00, NULL, 'Tons'),
        (crop_cover_uuid, farm_uuid, 'Cover Crops', 'Crimson Clover & Rye', 'South Basin Rest', 54.00, '2026-02-20', '2026-09-01', 'growing', 50.00, NULL, 'Tons'),
        (crop_greens_uuid, farm_uuid, 'Specialty Greens', 'Baby Spinach & Tuscan Kale', 'Greenhouse 1-3', 36.00, '2026-05-01', '2026-06-25', 'growing', 85.00, NULL, 'Tons')
    ON CONFLICT (id) DO NOTHING;

    -- 6. Livestock (342 Heads total)
    INSERT INTO livestock (farm_id, tag_id, animal_type, breed, age_months, gender, health_status, weight_kg, pasture_location, feed_schedule, last_vaccination_date)
    VALUES
        (farm_uuid, 'COW-4021', 'Cattle', 'Holstein Dairy', 28, 'female', 'healthy', 610.5, 'North Meadow Pasture 4', 'Daily 12kg Timothy Hay + Organic Grain', '2026-04-10'),
        (farm_uuid, 'COW-4022', 'Cattle', 'Black Angus', 18, 'female', 'healthy', 540.0, 'North Meadow Pasture 4', 'Daily 10kg Timothy Hay', '2026-04-10'),
        (farm_uuid, 'LOT-CALF-04', 'Cattle', 'Dairy Calves Lot #4', 6, 'female', 'treatment', 185.0, 'Calf Nursery Barn 2', 'Twice daily milk replacer & starter mix', '2026-01-15'),
        (farm_uuid, 'SHP-1092', 'Sheep', 'Katahdin Hair Sheep', 14, 'male', 'healthy', 82.0, 'West Ridge Section 2', 'Grazing + Mineral salt block', '2026-03-22')
    ON CONFLICT (farm_id, tag_id) DO NOTHING;

    -- 7. Inventory Items (Low items highlighted in screenshot)
    INSERT INTO inventory_items (farm_id, name, category, sku, quantity, unit, reorder_level, unit_cost, supplier_id, storage_location, expiry_date)
    VALUES
        (farm_uuid, 'Drip Irrigation Fittings', 'Irrigation', 'IRR-DRIP-50', 20.0, 'Units', 50.0, 14.50, supplier_irr_uuid, 'Shed 3 Shelf B', '2028-12-31'),
        (farm_uuid, 'Urea 46% Nitrogen', 'Fertilizers', 'FERT-UREA-46', 15.0, 'Bags', 40.0, 38.00, supplier_agg_uuid, 'Main Warehouse Bay 1', '2027-05-15'),
        (farm_uuid, 'Organic Neem Oil Extract', 'Pesticides', 'PEST-NEEM-10', 8.0, 'Liters', 25.0, 45.00, supplier_agg_uuid, 'Chemical Locker A', '2026-11-30'),
        (farm_uuid, 'Certified Sweet Corn Seeds', 'Seeds', 'SEED-CORN-01', 30.0, 'Bags', 10.0, 120.00, supplier_agg_uuid, 'Seed Vault Cold Room', '2027-03-01'),
        (farm_uuid, 'High Protein Calf Pellets', 'Feed', 'FEED-CALF-PR', 45.0, 'Bags', 20.0, 28.50, supplier_agg_uuid, 'Feed Silo C', '2026-10-15')
    ON CONFLICT DO NOTHING;

    -- 8. Equipment
    INSERT INTO equipment (id, farm_id, name, model, serial_number, status, purchase_date, purchase_cost, last_service_date, next_service_due, assigned_operator_id, notes)
    VALUES
        (equip_tractor_uuid, farm_uuid, 'John Deere 8R Tractor', '8R 340 Gen4', 'JD-8R-2023-8821', 'under_maintenance', '2023-04-12', 285000.00, '2026-03-10', '2026-06-12', worker_uuid, '250-hour routine fluid change overdue by 2 days. Plot C deploy held.'),
        (uuid_generate_v4(), farm_uuid, 'Valley Center Pivot Irrigation', 'Model 8000 Series', 'VLY-PIVOT-771', 'active', '2022-08-15', 72000.00, '2026-05-01', '2026-08-01', worker_uuid, 'South Pivot operating under high telemetry efficiency.')
    ON CONFLICT (id) DO NOTHING;

    -- 9. Tasks (Matching Upcoming Farm Tasks card)
    INSERT INTO tasks (farm_id, title, description, status, priority, assigned_to, due_date, related_plot, progress_percentage)
    VALUES
        (farm_uuid, 'Inspect South Pivot Irrigation Lines', 'Pressure check nozzles and run low-flow diagnostics', 'todo', 'high', worker_uuid, '2026-06-14 11:30:00+00', 'Plot B-2 (Sweet Corn)', 0),
        (farm_uuid, 'Calibrate Nitrogen Dosing for Hydroponics', 'Recalibrate EC/pH injector pumps and check nitrate sensors', 'in_progress', 'medium', worker_uuid, '2026-06-14 14:00:00+00', 'Greenhouse 3 (Greens)', 45),
        (farm_uuid, 'Pasture Rotation - Move Herd #2 to North Meadow', 'Open paddock gates 4B and verify perimeter electric fencing', 'todo', 'high', owner_uuid, '2026-06-14 16:30:00+00', 'Pasture Section 4', 0),
        (farm_uuid, 'Batch Moisture Testing for Granary Bin 04', 'Sample core temp and moisture reading (<14% target)', 'todo', 'normal', worker2_uuid, '2026-06-14 18:00:00+00', 'Wheat Silo A', 0)
    ON CONFLICT DO NOTHING;

    -- 10. Financial Transactions (Matching $54,820 Revenue, $21,390 OPEX, $33,430 Net Profit)
    INSERT INTO transactions (farm_id, type, category, amount, transaction_date, payment_method, reference_number, description)
    VALUES
        -- Income
        (farm_uuid, 'sale', 'Crop Sales', 32400.00, '2026-06-08', 'Wire Transfer', 'INV-2026-0881', 'Contract delivery of wholesale organic sweet corn'),
        (farm_uuid, 'sale', 'Livestock Sales', 14220.00, '2026-06-10', 'Direct Deposit', 'INV-2026-0892', 'Grade-A Organic Raw Milk Bulk Delivery'),
        (farm_uuid, 'sale', 'Crop Sales', 8200.00, '2026-06-12', 'Direct Deposit', 'INV-2026-0905', 'Valley Distribution Organic Spinach Batch'),
        -- Expenses
        (farm_uuid, 'expense', 'Fertilizer & Chemicals', 7450.00, '2026-06-02', 'Bank Card', 'EXP-2026-041', 'Organic certified foliar spray and compost blend'),
        (farm_uuid, 'expense', 'Fuel & Energy', 4820.00, '2026-06-05', 'ACH Transfer', 'EXP-2026-042', 'Diesel fuel supply for heavy machinery and generators'),
        (farm_uuid, 'expense', 'Labor & Payroll', 6120.00, '2026-06-07', 'Direct Deposit', 'EXP-2026-043', 'Bi-weekly field crew and irrigation technician labor'),
        (farm_uuid, 'expense', 'Equipment Maintenance', 3000.00, '2026-06-11', 'Credit Card', 'EXP-2026-044', 'Replacement hydraulic seals and filters')
    ON CONFLICT DO NOTHING;

    -- 11. Notifications (Matching Operational Alerts)
    INSERT INTO notifications (farm_id, title, message, type, is_read, link)
    VALUES
        (farm_uuid, 'Low Inventory Alert', 'Drip Irrigation Fittings below buffer threshold. 20 units remaining (Buffer: 50)', 'low_stock', false, '/inventory'),
        (farm_uuid, 'Maintenance Overdue', 'John Deere 8R Tractor 250-hour routine fluid change. Overdue by 2 days (Plot C deploy held)', 'maintenance_due', false, '/equipment'),
        (farm_uuid, 'Vaccination Reminder', 'Lot #4 Dairy Calves: Booster BVD scheduled for Tomorrow, 08:30 AM', 'vaccination_due', false, '/livestock')
    ON CONFLICT DO NOTHING;

    -- 12. Activity Logs (Matching Recent Field Logs stream)
    INSERT INTO activity_logs (farm_id, user_name, action, module, details, created_at)
    VALUES
        (farm_uuid, 'Marcus J.', 'marked Irrigation Cycle Plot B completed', 'Crops', '25m ago • Telemetry recorded 4,200L', NOW() - INTERVAL '25 minutes'),
        (farm_uuid, 'Logistics Gate', 'Fertilizer delivery PO-4091 received at Barn 2', 'Inventory', '1h 10m ago • Signed by Thomas C.', NOW() - INTERVAL '70 minutes'),
        (farm_uuid, 'IoT Soil Mesh', 'adjusted automated misting in greenhouse nursery', 'Telemetry', '2h 45m ago • VPD Target stabilized 0.85 kPa', NOW() - INTERVAL '165 minutes'),
        (farm_uuid, 'Sarah Jenkins', 'issued batch manifest for wholesale organic spinach', 'Finance', '4h ago • 840 kg to Valley Distribution', NOW() - INTERVAL '240 minutes')
    ON CONFLICT DO NOTHING;
END $$;
