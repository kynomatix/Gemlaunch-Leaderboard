const Database = require('better-sqlite3');
const db = new Database('./database.db');

console.log('Fixing missing accolades and points for real users...');

// Restore missing accolades for users 4 and 5
const accoladesToAdd = [
  // User 4 accolades
  { userId: 4, type: 'genesis_member', points: 5000 },
  { userId: 4, type: 'gemlaunch_pioneer', points: 2000 },
  { userId: 4, type: 'early_adopter', points: 500 },
  { userId: 4, type: 'token_creator', points: 200 },
  { userId: 4, type: 'presale_participant', points: 150 },
  { userId: 4, type: 'first_funding', points: 200 },
  
  // User 5 accolades  
  { userId: 5, type: 'genesis_member', points: 5000 },
  { userId: 5, type: 'gemlaunch_pioneer', points: 2000 },
  { userId: 5, type: 'early_adopter', points: 500 },
  { userId: 5, type: 'token_creator', points: 200 },
  { userId: 5, type: 'first_funding', points: 200 }
];

// Clear existing accolades for users 4 and 5
db.exec('DELETE FROM accolades WHERE user_id IN (4, 5)');

// Add proper accolades
for (const accolade of accoladesToAdd) {
  const exists = db.prepare('SELECT id FROM accolades WHERE user_id = ? AND accolade_type = ?').get(accolade.userId, accolade.type);
  if (!exists) {
    db.prepare('INSERT INTO accolades (user_id, accolade_type, level, multiplier, unlocked_at) VALUES (?, ?, 1, 0.0, ?)').run(
      accolade.userId, accolade.type, '2025-06-19 01:00:00'
    );
    console.log(`Added ${accolade.type} to User ${accolade.userId}`);
  }
}

// Recalculate points correctly
const users = [3, 4, 5];
for (const userId of users) {
  // Get base activity points
  const activities = db.prepare('SELECT SUM(points) as total FROM activities WHERE user_id = ?').get(userId);
  const basePoints = activities.total || 0;
  
  // Get accolade bonus points
  const accolades = db.prepare('SELECT accolade_type FROM accolades WHERE user_id = ?').all(userId);
  const accoladePoints = {
    'genesis_member': 5000,
    'gemlaunch_pioneer': 2000,
    'early_adopter': 500,
    'token_creator': 200,
    'presale_participant': 150,
    'first_funding': 200
  };
  
  const accoladeBonus = accolades.reduce((total, acc) => total + (accoladePoints[acc.accolade_type] || 0), 0);
  
  // Add volume contribution (1pt per $1 USD)
  let volumeBonus = 0;
  const volumeActivities = db.prepare('SELECT metadata FROM activities WHERE user_id = ? AND activity_type = "volume_contribution"').all(userId);
  for (const activity of volumeActivities) {
    if (activity.metadata) {
      try {
        const metadata = JSON.parse(activity.metadata);
        if (metadata.amount && metadata.amount.includes('USD')) {
          const usdAmount = parseFloat(metadata.amount.replace(' USD', ''));
          volumeBonus += usdAmount;
        }
      } catch (e) {}
    }
  }
  
  const totalPoints = basePoints + accoladeBonus + volumeBonus;
  db.prepare('UPDATE users SET total_points = ? WHERE id = ?').run(totalPoints, userId);
  
  console.log(`User ${userId}: ${basePoints} base + ${accoladeBonus} accolades + ${volumeBonus} volume = ${totalPoints} total`);
}

// Show final state
console.log('\nFinal leaderboard:');
const final = db.prepare('SELECT id, wallet_address, total_points FROM users ORDER BY total_points DESC').all();
final.forEach((u, i) => console.log(`${i+1}. User ${u.id} (${u.wallet_address.substring(0,8)}...): ${u.total_points.toLocaleString()} pts`));

db.close();
