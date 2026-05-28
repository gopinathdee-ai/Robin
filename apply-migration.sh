#!/bin/bash

# Apply union_local_name migration to the database
# This script applies the SQL migration to add the union_local_name column to the users table

set -e

echo "🔧 Applying database migration: add_union_local_name"
echo ""

# Get database connection details from environment or use defaults
DB_HOST=${DATABASE_URL_HOST:-localhost}
DB_PORT=${DATABASE_URL_PORT:-5432}
DB_NAME=${DATABASE_URL_DB:-trades_platform}
DB_USER=${DATABASE_URL_USER:-postgres}
DB_PASSWORD=${DATABASE_URL_PASSWORD}

echo "📌 Database Configuration:"
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo ""

# Run the migration SQL
echo "⏳ Running migration SQL..."

MIGRATION_SQL="ALTER TABLE \"users\" ADD COLUMN \"union_local_name\" VARCHAR(200);"

if [ -n "$DB_PASSWORD" ]; then
  PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "$MIGRATION_SQL"
else
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "$MIGRATION_SQL"
fi

echo ""
echo "✅ Migration applied successfully!"
echo ""
echo "The union_local_name column has been added to the users table."
echo "The application is now ready to use union local functionality."
