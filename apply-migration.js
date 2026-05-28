#!/usr/bin/env node

/**
 * Apply database migration: add_union_local_name
 * Adds the union_local_name column to the users table
 *
 * Usage:
 *   node apply-migration.js
 *
 * Environment variables:
 *   DATABASE_URL - Full PostgreSQL connection string
 *   Or individual settings:
 *   - DATABASE_URL_HOST (default: localhost)
 *   - DATABASE_URL_PORT (default: 5432)
 *   - DATABASE_URL_DB (default: trades_platform)
 *   - DATABASE_URL_USER (default: postgres)
 *   - DATABASE_URL_PASSWORD
 */

const { Client } = require('pg');

async function applyMigration() {
  // Parse connection details from DATABASE_URL or environment variables
  let connectionConfig;

  if (process.env.DATABASE_URL) {
    // Parse full connection string
    const url = new URL(process.env.DATABASE_URL);
    connectionConfig = {
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      database: url.pathname.slice(1),
      user: url.username,
      password: url.password,
    };
  } else {
    // Use individual environment variables
    connectionConfig = {
      host: process.env.DATABASE_URL_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_URL_PORT || '5432'),
      database: process.env.DATABASE_URL_DB || 'trades_platform',
      user: process.env.DATABASE_URL_USER || 'postgres',
      password: process.env.DATABASE_URL_PASSWORD,
    };
  }

  const client = new Client(connectionConfig);

  try {
    console.log('🔧 Applying database migration: add_union_local_name');
    console.log('');
    console.log('📌 Database Configuration:');
    console.log(`   Host: ${connectionConfig.host}`);
    console.log(`   Port: ${connectionConfig.port}`);
    console.log(`   Database: ${connectionConfig.database}`);
    console.log(`   User: ${connectionConfig.user}`);
    console.log('');

    console.log('⏳ Connecting to database...');
    await client.connect();
    console.log('✅ Connected');
    console.log('');

    console.log('⏳ Running migration SQL...');
    const migrationSQL = `ALTER TABLE "users" ADD COLUMN "union_local_name" VARCHAR(200);`;

    await client.query(migrationSQL);
    console.log('✅ Migration SQL executed');
    console.log('');

    console.log('✅ Migration applied successfully!');
    console.log('');
    console.log('The union_local_name column has been added to the users table.');
    console.log('The application is now ready to use union local functionality.');

  } catch (error) {
    if (error.code === '42701') {
      // Column already exists
      console.log('ℹ️  Column "union_local_name" already exists in the users table.');
      console.log('Migration skipped - the application is ready to use.');
    } else {
      console.error('❌ Error applying migration:');
      console.error(error.message);
      process.exit(1);
    }
  } finally {
    await client.end();
  }
}

applyMigration();
