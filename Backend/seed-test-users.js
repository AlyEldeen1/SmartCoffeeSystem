require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./src/config/db');

const seedTestUsers = async () => {
  try {
    console.log('🚀 Starting test users seed...\n');

    const testUsers = [
      {
        name: 'Alice Johnson',
        email: 'alice@koff.com',
        password: 'Alice@123',
        phone_number: '+201001234567',
        role: 'customer',
      },
      {
        name: 'Bob Smith',
        email: 'bob@koff.com',
        password: 'Bob@123',
        phone_number: '+201002345678',
        role: 'customer',
      },
      {
        name: 'Cashier User',
        email: 'cashier@koff.com',
        password: 'Cashier@123',
        phone_number: '+201003456789',
        role: 'cashier',
      },
    ];

    let createdCount = 0;
    let skippedCount = 0;

    for (const userData of testUsers) {
      try {
        // Check if user already exists
        const existingUser = await pool.query(
          'SELECT * FROM users WHERE email = $1',
          [userData.email]
        );

        if (existingUser.rows.length > 0) {
          console.log(`⏭️  Skipped ${userData.email} (already exists)`);
          skippedCount++;
          continue;
        }

        // Hash password
        const password_hash = await bcrypt.hash(userData.password, 10);

        // Create user
        await pool.query(
          `INSERT INTO users (name, email, phone_number, password_hash, role)
           VALUES ($1, $2, $3, $4, $5)`,
          [userData.name, userData.email, userData.phone_number, password_hash, userData.role]
        );

        console.log(`✅ Created ${userData.email} (${userData.role})`);
        createdCount++;
      } catch (err) {
        console.error(`❌ Error creating ${userData.email}:`, err.message);
      }
    }

    console.log('\n' + '─'.repeat(50));
    console.log(`📊 Seed Complete: ${createdCount} created, ${skippedCount} skipped`);
    console.log('─'.repeat(50));
    console.log('\n📋 Test Credentials:\n');

    const allUsers = [
      { email: 'admin@koff.com', password: 'Admin@123', role: 'admin' },
      { email: 'alice@koff.com', password: 'Alice@123', role: 'customer' },
      { email: 'bob@koff.com', password: 'Bob@123', role: 'customer' },
      { email: 'cashier@koff.com', password: 'Cashier@123', role: 'cashier' },
    ];

    allUsers.forEach((user) => {
      console.log(`${user.role.toUpperCase().padEnd(10)} | ${user.email.padEnd(20)} | ${user.password}`);
    });

    console.log('\n💡 Login at: http://localhost:5173/login\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding test users:', err.message);
    process.exit(1);
  }
};

seedTestUsers();
