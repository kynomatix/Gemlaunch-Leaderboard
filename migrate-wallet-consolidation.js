const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

try {
  console.log('Adding wallet consolidation fields to users table...');
  
  // Add the new columns for wallet consolidation
  db.exec(`
    ALTER TABLE users ADD COLUMN is_main_account INTEGER DEFAULT 1 NOT NULL;
    ALTER TABLE users ADD COLUMN parent_user_id INTEGER;
  `);
  
  console.log('✓ Successfully added wallet consolidation fields');
  console.log('✓ All existing users are now marked as main accounts');
  
} catch (error) {
  if (error.message.includes('duplicate column name')) {
    console.log('✓ Wallet consolidation fields already exist');
  } else {
    console.error('Error updating database:', error);
  }
} finally {
  db.close();
}