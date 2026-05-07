# Database Seeding Guide

This guide explains how to seed test users into the Smart Coffee System database.

## Prerequisites

- PostgreSQL database running and configured in `.env`
- Backend dependencies installed (`npm install`)
- Database and `users` table created

## Available Seed Scripts

### 1. Seed Admin User

Creates a single admin user for testing administrative features.

```bash
npm run seed:admin
```

**Admin Credentials:**
- Email: `admin@koff.com`
- Password: `Admin@123`
- Role: `admin`

### 2. Seed Test Users

Creates multiple test users with different roles (customers and cashier).

```bash
npm run seed:test
```

**Test Users Created:**

| Role     | Email               | Password      |
|----------|-------------------- |---------------|
| Admin    | admin@koff.com      | Admin@123     |
| Customer | alice@koff.com      | Alice@123     |
| Customer | bob@koff.com        | Bob@123       |
| Cashier  | cashier@koff.com    | Cashier@123   |

## Running Seeds

1. **First time setup** - Create admin and test users:
   ```bash
   npm run seed:admin
   npm run seed:test
   ```

2. **Start the backend server**:
   ```bash
   npm run dev
   ```

3. **Login at frontend**:
   - Navigate to: `http://localhost:5173/login`
   - Use any of the credentials above
   - Test different roles and features

## User Roles & Features

### Admin Role
- Access to admin dashboard
- View all orders and users
- Full system management

### Cashier Role
- Process orders at the counter
- Manage payments
- View order queue

### Customer Role
- Browse coffee menu
- Place orders
- Track order status
- Earn loyalty points
- View order history

## Resetting Users

To delete a user and reseed:

```sql
-- Delete specific user
DELETE FROM users WHERE email = 'admin@koff.com';

-- Or delete all test users
DELETE FROM users WHERE email IN (
  'admin@koff.com',
  'alice@koff.com',
  'bob@koff.com',
  'cashier@koff.com'
);
```

Then run the seed script again.

## Notes

- Users are hashed with bcrypt for security
- Seeds check for existing users to avoid duplicates
- Each script can be run multiple times safely
- Passwords are visible only during seeding; save them securely
