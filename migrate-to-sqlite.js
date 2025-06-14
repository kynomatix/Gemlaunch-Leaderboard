// Migration script to transfer data from PostgreSQL to SQLite
const Database = require('better-sqlite3');
const { Client } = require('pg');

async function migrateData() {
  // Connect to PostgreSQL
  const pgClient = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  // Connect to SQLite
  const sqliteDb = new Database('./database.db');
  
  try {
    await pgClient.connect();
    console.log('Connected to PostgreSQL for migration');
    
    // Migrate users
    console.log('Migrating users...');
    const usersResult = await pgClient.query('SELECT * FROM users ORDER BY id');
    const insertUser = sqliteDb.prepare(`
      INSERT INTO users (id, wallet_address, username, total_points, referral_code, referred_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    for (const user of usersResult.rows) {
      insertUser.run(
        user.id,
        user.wallet_address,
        user.username,
        user.total_points,
        user.referral_code,
        user.referred_by,
        user.created_at.toISOString(),
        user.updated_at.toISOString()
      );
    }
    console.log(`Migrated ${usersResult.rows.length} users`);
    
    // Migrate activities
    console.log('Migrating activities...');
    const activitiesResult = await pgClient.query('SELECT * FROM activities ORDER BY id');
    const insertActivity = sqliteDb.prepare(`
      INSERT INTO activities (id, user_id, activity_type, points, transaction_hash, block_number, metadata, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    for (const activity of activitiesResult.rows) {
      insertActivity.run(
        activity.id,
        activity.user_id,
        activity.activity_type,
        activity.points,
        activity.transaction_hash,
        activity.block_number,
        JSON.stringify(activity.metadata),
        activity.created_at.toISOString()
      );
    }
    console.log(`Migrated ${activitiesResult.rows.length} activities`);
    
    // Migrate accolades
    console.log('Migrating accolades...');
    const accoladesResult = await pgClient.query('SELECT * FROM accolades ORDER BY id');
    const insertAccolade = sqliteDb.prepare(`
      INSERT INTO accolades (id, user_id, accolade_type, level, multiplier, unlocked_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    for (const accolade of accoladesResult.rows) {
      insertAccolade.run(
        accolade.id,
        accolade.user_id,
        accolade.accolade_type,
        accolade.level,
        parseFloat(accolade.multiplier),
        accolade.unlocked_at.toISOString()
      );
    }
    console.log(`Migrated ${accoladesResult.rows.length} accolades`);
    
    // Migrate referrals
    console.log('Migrating referrals...');
    const referralsResult = await pgClient.query('SELECT * FROM referrals ORDER BY id');
    const insertReferral = sqliteDb.prepare(`
      INSERT INTO referrals (id, referrer_id, referee_id, points_earned, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    for (const referral of referralsResult.rows) {
      insertReferral.run(
        referral.id,
        referral.referrer_id,
        referral.referee_id,
        referral.points_earned,
        referral.created_at.toISOString()
      );
    }
    console.log(`Migrated ${referralsResult.rows.length} referrals`);
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pgClient.end();
    sqliteDb.close();
  }
}

migrateData();