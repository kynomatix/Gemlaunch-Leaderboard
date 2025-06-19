const Database = require('better-sqlite3');
const db = new Database('./database.db');

// Clear existing accolades to start fresh
db.exec('DELETE FROM accolades');

// Get all users
const users = db.prepare('SELECT id FROM users ORDER BY id').all();

const accolades = [];

for (const user of users) {
  const userId = user.id;
  
  // Genesis Member (first 10 users)
  if (userId <= 10) {
    accolades.push({
      userId,
      accoladeType: 'genesis_member',
      level: 1,
      multiplier: 0.0,
      unlockedAt: '2025-06-19 01:00:00'
    });
  }
  
  // Gemlaunch Pioneer (first 50 users - all current users)
  accolades.push({
    userId,
    accoladeType: 'gemlaunch_pioneer', 
    level: 1,
    multiplier: 0.0,
    unlockedAt: '2025-06-19 01:00:00'
  });
  
  // Early Adopter (first 1000 users - all current users)
  accolades.push({
    userId,
    accoladeType: 'early_adopter',
    level: 1, 
    multiplier: 0.0,
    unlockedAt: '2025-06-19 01:00:00'
  });
  
  // Check for token creation activity
  const tokenActivity = db.prepare('SELECT * FROM activities WHERE user_id = ? AND activity_type = "token_creation"').get(userId);
  if (tokenActivity) {
    accolades.push({
      userId,
      accoladeType: 'token_creator',
      level: 1,
      multiplier: 0.0,
      unlockedAt: '2025-06-19 01:00:00'
    });
  }
  
  // Check for presale activity
  const presaleActivity = db.prepare('SELECT * FROM activities WHERE user_id = ? AND activity_type = "presale"').get(userId);
  if (presaleActivity) {
    accolades.push({
      userId,
      accoladeType: 'presale_participant',
      level: 1,
      multiplier: 0.0,
      unlockedAt: '2025-06-19 01:00:00'
    });
  }
  
  // Check for funding activities (dutch_auction, project_funding)
  const fundingActivity = db.prepare('SELECT * FROM activities WHERE user_id = ? AND (activity_type = "dutch_auction" OR activity_type = "project_funding")').get(userId);
  if (fundingActivity) {
    accolades.push({
      userId,
      accoladeType: 'first_funding',
      level: 1,
      multiplier: 0.0,
      unlockedAt: '2025-06-19 01:00:00'
    });
  }
}

// Insert all accolades
const insertStmt = db.prepare('INSERT INTO accolades (user_id, accolade_type, level, multiplier, unlocked_at) VALUES (?, ?, ?, ?, ?)');

for (const accolade of accolades) {
  insertStmt.run(accolade.userId, accolade.accoladeType, accolade.level, accolade.multiplier, accolade.unlockedAt);
}

console.log(`Assigned ${accolades.length} accolades to ${users.length} users`);

// Show final accolade distribution
const final = db.prepare('SELECT user_id, accolade_type FROM accolades ORDER BY user_id, accolade_type').all();
console.log('\nFinal accolade assignments:');
final.forEach(a => console.log(`User ${a.user_id}: ${a.accolade_type}`));

db.close();
