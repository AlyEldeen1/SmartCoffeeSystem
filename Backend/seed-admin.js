require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./src/config/db');

const seedAdminUser = async () => {
  try {
    console.log('🚀 Starting admin user seed...\n');

    // Admin user credentials
    const adminData = {
      name: 'Admin User',
      email: 'admin@koff.com',
      password: 'Admin@123',
      phone_number: '+201012345678',
      role: 'admin',
    };

    // Hash password
    const password_hash = await bcrypt.hash(adminData.password, 10);

    // Check if admin already exists
    const existingAdmin = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [adminData.email]
    );

    if (existingAdmin.rows.length > 0) {
      console.log('⚠️  Admin user already exists!');
      console.log('Email:', adminData.email);
      console.log('\nTo reset, delete the user from database:');
      console.log(`DELETE FROM users WHERE email = '${adminData.email}';`);
      process.exit(0);
    }

    // Create admin user
    const result = await pool.query(
      `INSERT INTO users (name, email, phone_number, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, phone_number, role, is_verified, created_at`,
      [adminData.name, adminData.email, adminData.phone_number, password_hash, adminData.role]
    );

    const newAdmin = result.rows[0];

    console.log('✅ Admin user created successfully!\n');
    console.log('📋 Admin Credentials:');
    console.log('─'.repeat(50));
    console.log(`Email:    ${adminData.email}`);
    console.log(`Password: ${adminData.password}`);
    console.log(`Role:     ${adminData.role}`);
    console.log(`Name:     ${adminData.name}`);
    console.log(`Phone:    ${adminData.phone_number}`);
    console.log('─'.repeat(50));
    console.log('\n🔐 Keep these credentials safe!');
    console.log('💡 You can now login at: http://localhost:5173/login\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding admin user:', err.message);
    console.error('📝 Error details:', err);
    process.exit(1);
  }
};

seedAdminUser();
