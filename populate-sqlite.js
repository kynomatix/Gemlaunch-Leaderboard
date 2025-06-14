// Direct population of SQLite database with existing data
import Database from 'better-sqlite3';

const db = new Database('./database.db');

try {
  console.log('Populating SQLite database with existing data...');
  
  // Disable foreign key constraints during migration
  db.pragma('foreign_keys = OFF');

  // Insert users
  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (id, wallet_address, username, total_points, referral_code, referred_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(3, '0x2d9b878DD5f779aF723a430F8d56f21dAc847592', null, 7800, 'YYNPXUN1', null, '2025-06-14 07:21:17.213287', '2025-06-14 07:21:17.476');
  insertUser.run(4, '0x1234567890123456789012345678901234567890', null, 10600, null, null, '2025-06-14 05:30:17.163773', '2025-06-14 05:30:17.163773');
  insertUser.run(5, '0x0987654321098765432109876543210987654321', null, 3700, null, null, '2025-06-14 05:30:17.163773', '2025-06-14 05:30:17.163773');

  console.log('Inserted 3 users');

  // Insert activities
  const insertActivity = db.prepare(`
    INSERT OR REPLACE INTO activities (id, user_id, activity_type, points, transaction_hash, block_number, metadata, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertActivity.run(10, 3, 'welcome_bonus', 100, null, null, '{"reason": "Welcome to GemLaunch!"}', '2025-06-14 08:04:08.973253');
  insertActivity.run(11, 3, 'accolade_earned', 100, null, null, '{"description": "Earned Gemlaunch Pioneer status as one of the first 50 users!", "accoladeType": "gemlaunch_pioneer"}', '2025-06-14 08:04:08.973253');
  insertActivity.run(19, 4, 'token_creation', 500, null, null, null, '2025-06-14 05:30:24.548036');
  insertActivity.run(20, 4, 'fair_launch', 300, null, null, null, '2025-06-14 05:30:24.548036');
  insertActivity.run(21, 4, 'volume_trading', 250, null, null, null, '2025-06-14 05:30:24.548036');
  insertActivity.run(22, 4, 'presale_participation', 200, null, null, null, '2025-06-14 05:30:24.548036');
  insertActivity.run(23, 5, 'token_creation', 500, null, null, null, '2025-06-14 05:30:24.548036');
  insertActivity.run(24, 5, 'volume_trading', 175, null, null, null, '2025-06-14 05:30:24.548036');

  console.log('Inserted 8 activities');

  // Insert accolades
  const insertAccolade = db.prepare(`
    INSERT OR REPLACE INTO accolades (id, user_id, accolade_type, level, multiplier, unlocked_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertAccolade.run(6, 3, 'gemlaunch_pioneer', 1, 0.00, '2025-06-14 08:04:17.144733');
  insertAccolade.run(16, 3, 'genesis_member', 1, 0.00, '2025-06-14 09:45:13.532771');
  insertAccolade.run(17, 3, 'early_adopter', 3, 0.00, '2025-06-14 09:45:13.532771');
  insertAccolade.run(14, 4, 'gemlaunch_pioneer', 1, 0.00, '2025-06-14 05:30:17');
  insertAccolade.run(18, 4, 'genesis_member', 1, 0.00, '2025-06-14 05:30:17');
  insertAccolade.run(19, 4, 'early_adopter', 1, 0.00, '2025-06-14 05:30:17');
  insertAccolade.run(21, 4, 'token_creator', 1, 0.00, '2025-06-14 05:30:30');
  insertAccolade.run(22, 4, 'launch_master', 1, 0.00, '2025-06-14 05:30:35');
  insertAccolade.run(23, 4, 'funding_veteran', 1, 0.00, '2025-06-14 05:30:40');
  insertAccolade.run(24, 4, 'presale_participant', 1, 0.00, '2025-06-14 05:30:45');
  insertAccolade.run(15, 5, 'gemlaunch_pioneer', 1, 0.00, '2025-06-14 05:30:17');
  insertAccolade.run(20, 5, 'early_adopter', 1, 0.00, '2025-06-14 05:30:17');
  insertAccolade.run(25, 5, 'token_creator', 1, 0.00, '2025-06-14 05:30:30');
  insertAccolade.run(26, 5, 'first_funding', 1, 0.00, '2025-06-14 05:30:40');

  console.log('Inserted 14 accolades');

  // Re-enable foreign key constraints
  db.pragma('foreign_keys = ON');
  
  console.log('Data population completed successfully!');
  
} catch (error) {
  console.error('Error populating database:', error);
} finally {
  db.close();
}