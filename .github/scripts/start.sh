#!/bin/sh
set -e

echo "Starting deployment script..."

# Ensure database schema exists if no migrations are present
if [ ! -d "prisma/migrations" ] || [ -z "$(ls -A prisma/migrations 2>/dev/null)" ]; then
  echo "No Prisma migrations found. Pushing schema to database..."
  tries=0
  until prisma db push --accept-data-loss --skip-generate || [ $tries -ge 10 ]; do
    tries=$((tries+1))
    sleep 5
  done
  if [ $tries -ge 10 ]; then
    echo "ERROR: Prisma db push failed!"
    exit 1
  fi
else
  # Run migrations (only if migrations exist)
  echo "Running database migrations..."
  tries=0
  until prisma migrate deploy > /tmp/migration.log 2>&1 || [ $tries -ge 10 ]; do
    tries=$((tries+1))
    sleep 5
  done
  if [ $tries -ge 10 ]; then
    cat /tmp/migration.log
    echo "ERROR: Database migration failed!"

    # Attempt to resolve known stuck migration 20260208_init (keeping this logic just in case, though might not be relevant for this project)
    if grep -q "20260208_init" /tmp/migration.log && grep -q "failed" /tmp/migration.log; then
      echo "Detected stuck migration '20260208_init'. Attempting to rollback..."
      if prisma migrate resolve --rolled-back "20260208_init"; then
        echo "Rollback successful. Retrying migration..."
        if prisma migrate deploy; then
          echo "Retry successful!"
        else
          echo "ERROR: Retry failed!"
          exit 1
        fi
      else
        echo "ERROR: Failed to rollback migration!"
        exit 1
      fi
    else
      echo "Please check your DATABASE_URL environment variable."
      if [ -n "$DATABASE_URL" ]; then
        echo "DATABASE_URL is set (length: ${#DATABASE_URL})"
      else
        echo "DATABASE_URL is NOT set!"
      fi
      exit 1
    fi
  else
    cat /tmp/migration.log
  fi
  rm -f /tmp/migration.log
fi

# Run seeding (only if SEED_DB is true to prevent data overwrite)
if [ "$SEED_DB" = "true" ]; then
  echo "Seeding database..."
  tsx prisma/seed.ts
else
  echo "Skipping seeding (SEED_DB not set to true)."
fi

# Ensure at least one SUPER_ADMIN exists automatically if env provided
if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
  echo "Checking for existing admin users..."
  set +e
  tsx prisma/create-super-admin.ts
  ADMIN_BOOTSTRAP_EXIT_CODE=$?
  set -e
  if [ $ADMIN_BOOTSTRAP_EXIT_CODE -ne 0 ]; then
    echo "WARNING: Failed to ensure SUPER_ADMIN user (exit code $ADMIN_BOOTSTRAP_EXIT_CODE). Continuing startup."
  fi
else
  echo "Skipping admin bootstrap (ADMIN_EMAIL or ADMIN_PASSWORD not set)."
fi

# Start the application
echo "Starting application on port ${PORT}..."
exec node server.js
