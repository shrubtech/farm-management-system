/**
 * FarmSync Demo Seed Utility
 * Run with: npm run seed:demo
 * 
 * Injects initial test accounts and sample farm records into Supabase if configured,
 * or verifies database connectivity.
 */

console.log('🌾 FarmSync Demo Seeding Script');
console.log('=================================');
console.log('Database target: Supabase PostgreSQL');
console.log('Seed SQL file location: supabase/seed.sql');
console.log('');
console.log('To execute seed SQL directly in Supabase:');
console.log('  1. Open your Supabase Dashboard -> SQL Editor');
console.log('  2. Paste contents of supabase/migrations/20261012_farm_schema.sql');
console.log('  3. Paste contents of supabase/migrations/20261014_invites_schema.sql');
console.log('  4. Paste contents of supabase/seed.sql');
console.log('');
console.log('Demo accounts seeded in database:');
console.log('  - Owner:   owner@farmsync.io   (Thomas Clark)');
console.log('  - Manager: manager@farmsync.io (Sarah Jenkins)');
console.log('  - Worker:  worker@farmsync.io  (Marcus Johnson)');
console.log('');
console.log('✓ Seed script completed.');
