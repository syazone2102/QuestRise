/* ============================================================
   QUESTRISE — Core Game Engine
   Handles: Profile System, State, XP, Levels, Quests, Duels
   ============================================================ */

'use strict';

// ============================================================
// CONSTANTS
// ============================================================
const CLASSES = {
  warrior: {
    name: 'Warrior', emoji: '⚔️', color: '#ef4444',
    description: 'Forge your body through discipline. Masters of strength and endurance.',
    primaryStat: 'str',
    bonuses: { str: 5, vit: 3, agi: 2 },
    skills: [
      { name: 'Iron Will',      desc: 'Discipline quests give +20% XP',              icon: '🛡️' },
      { name: 'Battle Hardened',desc: 'Fitness tasks boost STR faster',              icon: '💪' },
      { name: 'Endure',         desc: 'Never lose streak for one missed day per week',icon: '🔥' }
    ]
  },
  scholar: {
    name: 'Scholar', emoji: '📚', color: '#3b82f6',
    description: 'Pursue knowledge relentlessly. Masters of intellect and wisdom.',
    primaryStat: 'int',
    bonuses: { int: 5, lck: 3, cha: 2 },
    skills: [
      { name: 'Deep Study',   desc: 'Study quests give +20% XP',          icon: '🧠' },
      { name: 'Quick Learner',desc: 'INT grows 25% faster from tasks',     icon: '⚡' },
      { name: 'Insight',      desc: '+5 LCK on completing 5 quests/week', icon: '✨' }
    ]
  },
  merchant: {
    name: 'Merchant', emoji: '💰', color: '#f59e0b',
    description: 'Build wealth and connections. Masters of charisma and opportunity.',
    primaryStat: 'cha',
    bonuses: { cha: 5, int: 3, lck: 2 },
    skills: [
      { name: 'Silver Tongue', desc: 'Social quests give +20% XP',      icon: '🗣️' },
      { name: 'Network',       desc: 'CHA grows 25% faster from tasks',  icon: '🤝' },
      { name: 'Opportunity',   desc: 'Daily login gives +2 LCK',         icon: '🍀' }
    ]
  },
  healer: {
    name: 'Healer', emoji: '💚', color: '#10b981',
    description: 'Nurture mind and body. Masters of vitality and wellbeing.',
    primaryStat: 'vit',
    bonuses: { vit: 5, cha: 3, int: 2 },
    skills: [
      { name: 'Restoration', desc: 'Health quests give +20% XP',            icon: '❤️‍🩹' },
      { name: 'Empathy',     desc: 'CHA grows alongside VIT',               icon: '🌸' },
      { name: 'Inner Peace', desc: 'Mindfulness tasks give double VIT',     icon: '🧘' }
    ]
  },
  ranger: {
    name: 'Ranger', emoji: '🏹', color: '#84cc16',
    description: 'Adapt and explore. Masters of agility and versatility.',
    primaryStat: 'agi',
    bonuses: { agi: 5, str: 3, vit: 2 },
    skills: [
      { name: 'Swift Strike', desc: 'Speed quests give +20% XP',                    icon: '💨' },
      { name: 'Pathfinder',   desc: 'AGI grows 25% faster from tasks',              icon: '🗺️' },
      { name: 'Adapt',        desc: 'Bonus XP for diverse quest categories',         icon: '🦎' }
    ]
  },
  mage: {
    name: 'Mage', emoji: '✨', color: '#8b5cf6',
    description: 'Channel creativity and focus. Masters of the arcane arts of mind.',
    primaryStat: 'int',
    bonuses: { int: 4, lck: 4, cha: 2 },
    skills: [
      { name: 'Arcane Focus',  desc: 'Creative quests give +20% XP',            icon: '🔮' },
      { name: 'Creative Surge',desc: 'LCK grows 25% faster from tasks',          icon: '🌌' },
      { name: 'Spell Forge',   desc: 'Every 10 quests unlock a random stat bonus',icon: '📜' }
    ]
  }
};

const STATS = {
  str: { label: 'Strength',     short: 'STR', icon: '💪', color: '#ef4444' },
  int: { label: 'Intelligence', short: 'INT', icon: '🧠', color: '#3b82f6' },
  agi: { label: 'Agility',      short: 'AGI', icon: '⚡', color: '#10b981' },
  vit: { label: 'Vitality',     short: 'VIT', icon: '❤️', color: '#f59e0b' },
  cha: { label: 'Charisma',     short: 'CHA', icon: '✨', color: '#ec4899' },
  lck: { label: 'Luck',         short: 'LCK', icon: '🍀', color: '#8b5cf6' }
};

const CATEGORIES = {
  fitness:      { label: 'Fitness',      stat: 'str', icon: '🏋️', xp: 60, color: '#ef4444' },
  study:        { label: 'Study',        stat: 'int', icon: '📖', xp: 55, color: '#3b82f6' },
  sport:        { label: 'Sport',        stat: 'agi', icon: '⚡', xp: 50, color: '#10b981' },
  health:       { label: 'Health',       stat: 'vit', icon: '🍎', xp: 50, color: '#f59e0b' },
  social:       { label: 'Social',       stat: 'cha', icon: '🤝', xp: 45, color: '#ec4899' },
  creative:     { label: 'Creative',     stat: 'lck', icon: '🎨', xp: 45, color: '#8b5cf6' },
  finance:      { label: 'Finance',      stat: 'cha', icon: '💰', xp: 55, color: '#f59e0b' },
  mindfulness:  { label: 'Mindfulness',  stat: 'vit', icon: '🧘', xp: 45, color: '#10b981' },
  productivity: { label: 'Productivity', stat: 'int', icon: '⚙️', xp: 50, color: '#3b82f6' },
  other:        { label: 'Other',        stat: 'lck', icon: '🎯', xp: 30, color: '#8b5cf6' }
};

const DIFFICULTIES = {
  easy:   { label: 'Easy',   multiplier: 0.7, icon: '🟢' },
  medium: { label: 'Medium', multiplier: 1.0, icon: '🟡' },
  hard:   { label: 'Hard',   multiplier: 1.5, icon: '🔴' },
  epic:   { label: 'Epic',   multiplier: 2.5, icon: '💎' }
};

const SIMULATED_PLAYERS = [
  { id: 'sim_001', name: 'IronFist Kai',   class: 'warrior',  level: 22, xp: 18400, stats: { str:55, int:22, agi:34, vit:45, cha:18, lck:14 } },
  { id: 'sim_002', name: 'ArcaneWillow',   class: 'mage',     level: 19, xp: 14800, stats: { str:16, int:52, agi:24, vit:22, cha:30, lck:46 } },
  { id: 'sim_003', name: 'SilverTongue',   class: 'merchant', level: 17, xp: 11500, stats: { str:20, int:35, agi:22, vit:26, cha:50, lck:38 } },
  { id: 'sim_004', name: 'SwiftArrow',     class: 'ranger',   level: 15, xp: 10200, stats: { str:35, int:24, agi:50, vit:30, cha:22, lck:20 } },
  { id: 'sim_005', name: 'HealerLux',      class: 'healer',   level: 14, xp: 8900,  stats: { str:18, int:30, agi:20, vit:52, cha:40, lck:24 } },
  { id: 'sim_006', name: 'BookwormAsh',    class: 'scholar',  level: 13, xp: 7800,  stats: { str:14, int:58, agi:16, vit:20, cha:28, lck:36 } },
  { id: 'sim_007', name: 'GoldenShor',     class: 'merchant', level: 11, xp: 6200,  stats: { str:22, int:32, agi:24, vit:28, cha:44, lck:32 } },
  { id: 'sim_008', name: 'SteelMaven',     class: 'warrior',  level: 9,  xp: 4700,  stats: { str:40, int:18, agi:28, vit:36, cha:14, lck:12 } },
  { id: 'sim_009', name: 'FrostSage',      class: 'mage',     level: 7,  xp: 3300,  stats: { str:14, int:44, agi:20, vit:22, cha:26, lck:38 } },
  { id: 'sim_010', name: 'WildRunner',     class: 'ranger',   level: 5,  xp: 2100,  stats: { str:28, int:20, agi:42, vit:28, cha:18, lck:16 } }
];

const ACHIEVEMENTS = [
  { id: 'first_quest',  name: 'First Steps',   desc: 'Complete your first quest',   icon: '🌟', trigger: 'questsCompleted', value: 1  },
  { id: 'quest_10',     name: 'Quest Runner',   desc: 'Complete 10 quests',           icon: '⚔️', trigger: 'questsCompleted', value: 10 },
  { id: 'quest_50',     name: 'Legend',         desc: 'Complete 50 quests',           icon: '👑', trigger: 'questsCompleted', value: 50 },
  { id: 'level_5',      name: 'Rising Hero',    desc: 'Reach Level 5',               icon: '🔥', trigger: 'level', value: 5  },
  { id: 'level_10',     name: 'Veteran',        desc: 'Reach Level 10',              icon: '🏆', trigger: 'level', value: 10 },
  { id: 'level_20',     name: 'Champion',       desc: 'Reach Level 20',              icon: '💎', trigger: 'level', value: 20 },
  { id: 'first_duel',   name: 'First Blood',    desc: 'Win your first duel',         icon: '⚔️', trigger: 'duelsWon', value: 1 },
  { id: 'duel_5',       name: 'Duelist',        desc: 'Win 5 duels',                 icon: '🤺', trigger: 'duelsWon', value: 5 },
  { id: 'streak_7',     name: 'Week Warrior',   desc: 'Maintain a 7-day streak',     icon: '🗓️', trigger: 'streak', value: 7 }
];

// ============================================================
// PROFILE / SAVE FILE SYSTEM
// ============================================================
const PROFILES_KEY  = 'questrise_profiles_v1';
const ACTIVE_KEY    = 'questrise_active_v1';

function profileDataKey(profileId) {
  return `questrise_data_${profileId}`;
}

/** Get all profiles metadata object */
function getProfiles() {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function _saveProfiles(profiles) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

/** Get currently active profile ID */
function getActiveProfileId() {
  return localStorage.getItem(ACTIVE_KEY) || null;
}

/** Set which profile is active */
function setActiveProfile(profileId) {
  localStorage.setItem(ACTIVE_KEY, profileId);
}

/** Load a profile by ID (optionally check PIN) */
function loadProfile(profileId, pin = '') {
  const profiles = getProfiles();
  const profile = profiles[profileId];
  if (!profile) return { success: false, error: 'Profile not found' };
  if (profile.pin && profile.pin !== pin) return { success: false, error: 'Incorrect PIN' };
  setActiveProfile(profileId);
  return { success: true };
}

/** Delete a profile and its data */
function deleteProfile(profileId) {
  const profiles = getProfiles();
  delete profiles[profileId];
  _saveProfiles(profiles);
  localStorage.removeItem(profileDataKey(profileId));
  if (getActiveProfileId() === profileId) {
    localStorage.removeItem(ACTIVE_KEY);
  }
}

/** Logout (clear active profile, keep data) */
function logoutProfile() {
  localStorage.removeItem(ACTIVE_KEY);
  window.location.href = 'index.html';
}

/** Export current save as a JSON file download */
function exportSave() {
  const profileId = getActiveProfileId();
  if (!profileId) { showToast('No active profile to export', 'error'); return; }
  const profiles = getProfiles();
  const state = getState();
  const saveData = {
    _app: 'QuestRise',
    _version: 2,
    exportedAt: new Date().toISOString(),
    profile: profiles[profileId],
    gameData: state
  };
  const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const heroName = state?.character?.name || 'hero';
  a.download = `questrise_${heroName}_${todayStr()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`💾 Save file downloaded!`, 'success');
}

/** Import a save JSON file and add it as a new profile */
function importSave(jsonText) {
  try {
    const saveData = JSON.parse(jsonText);
    if (saveData._app !== 'QuestRise' || !saveData.profile || !saveData.gameData) {
      return { success: false, error: 'Invalid QuestRise save file.' };
    }
    const newId = 'profile_' + Date.now();
    const profiles = getProfiles();
    profiles[newId] = { ...saveData.profile, id: newId, lastPlayed: new Date().toISOString() };
    _saveProfiles(profiles);
    localStorage.setItem(profileDataKey(newId), JSON.stringify(saveData.gameData));
    setActiveProfile(newId);
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Could not parse save file: ' + e.message };
  }
}

// ============================================================
// STATE  (per-profile game data)
// ============================================================
function getState() {
  const id = getActiveProfileId();
  if (!id) return null;
  try {
    const raw = localStorage.getItem(profileDataKey(id));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveState(state) {
  const id = getActiveProfileId();
  if (!id) return;
  try {
    localStorage.setItem(profileDataKey(id), JSON.stringify(state));
    // Update profile metadata snapshot
    const profiles = getProfiles();
    if (profiles[id] && state.character) {
      profiles[id].lastPlayed = new Date().toISOString();
      profiles[id].heroName   = state.character.name;
      profiles[id].class      = state.character.class;
      profiles[id].level      = state.character.level;
      profiles[id].totalXp    = state.character.totalXp || 0;
      _saveProfiles(profiles);
    }
  } catch (e) { console.error('SaveState failed', e); }
}

function getCharacter() { const s = getState(); return s ? s.character : null; }
function getQuests()    { const s = getState(); return s ? (s.quests  || []) : []; }
function getDuels()     { const s = getState(); return s ? (s.duels   || []) : []; }
function getActivity()  { const s = getState(); return s ? (s.activity|| []) : []; }

// ============================================================
// CHARACTER CREATION
// ============================================================
function createCharacter(name, className, pin = '') {
  const cls = CLASSES[className];
  if (!cls) return null;

  const baseStats = { str:10, int:10, agi:10, vit:10, cha:10, lck:10 };
  Object.entries(cls.bonuses).forEach(([s, v]) => { baseStats[s] += v; });

  const character = {
    id: 'user_' + Date.now(),
    name: name.trim(),
    class: className,
    title: 'Novice ' + cls.name,
    level: 1,
    xp: 0,
    xpToNext: xpForLevel(1),
    totalXp: 0,
    stats: baseStats,
    questsCompleted: 0,
    duelsWon: 0,
    duelsLost: 0,
    streak: 0,
    lastLoginDate: todayStr(),
    achievements: [],
    createdAt: new Date().toISOString()
  };

  // Create profile metadata
  const profileId = 'profile_' + Date.now();
  const profiles = getProfiles();
  profiles[profileId] = {
    id: profileId,
    heroName: character.name,
    class: className,
    level: 1,
    totalXp: 0,
    pin: pin || '',
    createdAt: character.createdAt,
    lastPlayed: character.createdAt
  };
  _saveProfiles(profiles);
  setActiveProfile(profileId);

  saveState({ character, quests: [], duels: [], activity: [] });
  addActivity(`🎮 ${name} began their journey as a ${cls.name}!`);
  return character;
}

// ============================================================
// XP & LEVEL SYSTEM
// ============================================================

/**
 * XP required to level up FROM the given level.
 * Formula: base 120 * 1.65^(level-1) + bonus 50*(level-1)
 * This means each successive level costs noticeably more — early levels
 * are quick to reward, but later levels demand sustained effort.
 *  Level 1 → 120 XP    Level 5 → ~600 XP
 *  Level 10 → ~4 500 XP  Level 20 → ~150 000 XP
 */
function xpForLevel(level) {
  return Math.floor(120 * Math.pow(1.65, level - 1) + 50 * (level - 1));
}

function addXP(amount) {
  const state = getState();
  if (!state) return;
  const char = state.character;

  char.xp     += amount;
  char.totalXp = (char.totalXp || 0) + amount;

  while (char.xp >= char.xpToNext) {
    char.xp      -= char.xpToNext;
    char.level   += 1;
    char.xpToNext = xpForLevel(char.level);
    char.title    = getLevelTitle(char.level, char.class);
    addActivity(`🎉 Level UP! Now Level ${char.level}!`);
    saveState(state);
    checkAchievements(state);
    showLevelUp(char.level);
  }

  saveState(state);
  checkAchievements(state);
}

function getLevelTitle(level, cls) {
  const titles = {
    warrior:  ['Novice','Recruit','Fighter','Brawler','Gladiator','Champion','Warlord','Legend','Titan','Immortal'],
    scholar:  ['Novice','Student','Apprentice','Researcher','Scholar','Sage','Archmind','Oracle','Luminary','Transcendent'],
    merchant: ['Novice','Peddler','Trader','Dealer','Broker','Magnate','Tycoon','Baron','Mogul','Sovereign'],
    healer:   ['Novice','Aide','Medic','Herbalist','Healer','Shaman','Mender','Soulkeeper','Guardian','Archhealer'],
    ranger:   ['Novice','Scout','Tracker','Strider','Ranger','Pathfinder','Stalker','Predator','Phantom','Apex'],
    mage:     ['Novice','Apprentice','Arcanist','Invoker','Mage','Wizard','Sorcerer','Archmage','Enchanter','Ascendant']
  };
  const t   = titles[cls] || titles.warrior;
  const idx = Math.min(Math.floor((level - 1) / 3), t.length - 1);
  return t[idx] + ' ' + CLASSES[cls].name;
}

// ============================================================
// STAT SYSTEM
// ============================================================
function addStat(statKey, amount) {
  const state = getState();
  if (!state || !Object.prototype.hasOwnProperty.call(state.character.stats, statKey)) return;
  state.character.stats[statKey] = Math.min(999, state.character.stats[statKey] + amount);
  saveState(state);
}

// ============================================================
// QUEST COOLDOWN
// ============================================================
const QUEST_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Returns { ready: bool, remaining: 'Xm Ys' | null }
 * Quests created within the last 5 minutes cannot be completed yet.
 */
function questCooldownStatus(quest) {
  if (!quest || quest.completed) return { ready: false, remaining: null };
  const elapsed = Date.now() - new Date(quest.createdAt).getTime();
  if (elapsed >= QUEST_COOLDOWN_MS) return { ready: true, remaining: null };
  const left = QUEST_COOLDOWN_MS - elapsed;
  const m = Math.floor(left / 60000);
  const s = Math.floor((left % 60000) / 1000);
  return { ready: false, remaining: `${m}m ${String(s).padStart(2,'0')}s` };
}

// ============================================================
// QUEST SYSTEM
// ============================================================
function createQuest({ title, description='', category, difficulty, deadline='', recurring=null }) {
  const cat  = CATEGORIES[category]  || CATEGORIES.other;
  const diff = DIFFICULTIES[difficulty] || DIFFICULTIES.medium;
  const char = getCharacter();

  let classBonus = 1.0;
  if (char && category === getPrimaryCategory(char.class)) classBonus = 1.2;

  const xpReward = Math.round(cat.xp * diff.multiplier * classBonus);
  const statGain = Math.max(1, Math.round(cat.xp * diff.multiplier / 25));

  const quest = {
    id: 'quest_' + Date.now() + '_' + Math.random().toString(36).substr(2,5),
    title: title.trim(), description, category, difficulty,
    xpReward, statKey: cat.stat, statGain, deadline, recurring,
    completed: false, completedAt: null,
    createdAt: new Date().toISOString()   // ← used for 5-min cooldown
  };

  const state = getState();
  if (!state) return null;
  state.quests = [quest, ...(state.quests || [])];
  saveState(state);
  return quest;
}

function completeQuest(questId) {
  const state = getState();
  if (!state) return null;
  const quest = state.quests.find(q => q.id === questId);
  if (!quest || quest.completed) return null;

  // ── 5-minute cooldown guard ──────────────────────────────────
  const cd = questCooldownStatus(quest);
  if (!cd.ready) {
    showToast(`⏳ Quest locked! Wait ${cd.remaining} before completing.`, 'warning', 4000);
    return null;
  }

  quest.completed  = true;
  quest.completedAt = new Date().toISOString();
  state.character.questsCompleted = (state.character.questsCompleted || 0) + 1;

  saveState(state);
  addStat(quest.statKey, quest.statGain);
  addXP(quest.xpReward);
  addActivity(`✅ Completed "${quest.title}" (+${quest.xpReward} XP, +${quest.statGain} ${STATS[quest.statKey]?.short})`);

  if (quest.recurring) {
    const next = getNextRecurringDate(quest.deadline || todayStr(), quest.recurring);
    createQuest({ title: quest.title, description: quest.description, category: quest.category, difficulty: quest.difficulty, deadline: next, recurring: quest.recurring });
  }

  checkAchievements(getState());
  return quest;
}

function deleteQuest(questId) {
  const state = getState();
  if (!state) return;
  state.quests = state.quests.filter(q => q.id !== questId);
  saveState(state);
}

function getPrimaryCategory(className) {
  return { warrior:'fitness', scholar:'study', merchant:'finance', healer:'health', ranger:'sport', mage:'creative' }[className] || 'other';
}

function getNextRecurringDate(fromDate, recurring) {
  const d = new Date(fromDate);
  if (recurring === 'daily')  d.setDate(d.getDate() + 1);
  if (recurring === 'weekly') d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0];
}

// ============================================================
// DUEL SYSTEM
// ============================================================
function createDuel({ opponentId, taskTitle, taskCategory, taskDifficulty }) {
  const state    = getState();
  if (!state) return null;
  const char     = state.character;
  const opponent = SIMULATED_PLAYERS.find(p => p.id === opponentId);
  if (!opponent) return null;

  const now      = new Date();
  const deadline = new Date(now.getTime() + 48 * 3600000);
  const cat      = CATEGORIES[taskCategory] || CATEGORIES.other;
  const diff     = DIFFICULTIES[taskDifficulty] || DIFFICULTIES.medium;
  const xpReward = Math.round(cat.xp * diff.multiplier * 1.5);

  const duel = {
    id: 'duel_' + Date.now(),
    challenger: { id: char.id, name: char.name, class: char.class, level: char.level, emoji: CLASSES[char.class]?.emoji },
    opponent:   { id: opponent.id, name: opponent.name, class: opponent.class, level: opponent.level, emoji: CLASSES[opponent.class]?.emoji },
    task:       { title: taskTitle, category: taskCategory, difficulty: taskDifficulty, xpReward },
    status: 'active',
    challengerCompleted: false, opponentCompleted: false, winner: null,
    createdAt: now.toISOString(), deadline: deadline.toISOString()
  };

  if (Math.random() > 0.45) {
    duel.opponentCompletesAt = new Date(now.getTime() + (4 + Math.random() * 40) * 3600000).toISOString();
  }

  state.duels = [duel, ...(state.duels || [])];
  saveState(state);
  addActivity(`⚔️ You challenged ${opponent.name} to a duel! Task: "${taskTitle}"`);
  return duel;
}

function completeDuelChallenge(duelId) {
  const state = getState();
  if (!state) return null;
  const duel = state.duels.find(d => d.id === duelId);
  if (!duel || duel.status !== 'active') return null;

  duel.challengerCompleted    = true;
  duel.challengerCompletedAt  = new Date().toISOString();
  const now = new Date();

  if (duel.opponentCompletesAt) duel.opponentCompleted = new Date(duel.opponentCompletesAt) <= now;
  duel.status = 'completed';

  let won = false;
  if (!duel.opponentCompleted) {
    won = true;
  } else {
    won = new Date(duel.challengerCompletedAt) < new Date(duel.opponentCompletesAt);
  }

  if (won) {
    duel.winner = 'challenger';
    state.character.duelsWon = (state.character.duelsWon || 0) + 1;
    saveState(state);
    addXP(duel.task.xpReward);
    addActivity(`🏆 You WON the duel against ${duel.opponent.name}! (+${duel.task.xpReward} XP)`);
  } else {
    duel.winner = 'opponent';
    state.character.duelsLost = (state.character.duelsLost || 0) + 1;
    saveState(state);
    addXP(Math.floor(duel.task.xpReward * 0.25));
    addActivity(`😤 You lost the duel against ${duel.opponent.name}. Keep training!`);
  }

  checkAchievements(getState());
  return duel;
}

function expireDuels() {
  const state = getState();
  if (!state) return;
  const now = new Date();
  let changed = false;
  (state.duels || []).forEach(d => {
    if (d.status === 'active' && new Date(d.deadline) < now) {
      d.status = 'expired';
      if (!d.challengerCompleted) {
        d.winner = 'opponent';
        state.character.duelsLost = (state.character.duelsLost || 0) + 1;
      }
      changed = true;
    }
  });
  if (changed) saveState(state);
}

// ============================================================
// LEADERBOARD
// ============================================================
function getLeaderboard(classFilter = null) {
  const char = getCharacter();
  const players = [...SIMULATED_PLAYERS];
  if (char) {
    players.push({ id: char.id, name: char.name, class: char.class, level: char.level, xp: char.totalXp || 0, stats: char.stats, isUser: true });
  }
  let filtered = classFilter ? players.filter(p => p.class === classFilter) : players;
  filtered.sort((a, b) => b.level - a.level || b.xp - a.xp);
  return filtered.map((p, i) => ({ ...p, rank: i + 1 }));
}

// ============================================================
// ACHIEVEMENTS
// ============================================================
function checkAchievements(state) {
  if (!state?.character) return;
  const char    = state.character;
  const unlocked = char.achievements || [];

  ACHIEVEMENTS.forEach(ach => {
    if (unlocked.includes(ach.id)) return;
    const val = char[ach.trigger] || 0;
    if (val >= ach.value) {
      unlocked.push(ach.id);
      addActivity(`🏅 Achievement Unlocked: "${ach.name}"!`);
      showToast(`🏅 Achievement: ${ach.name}`, 'success');
    }
  });

  char.achievements = unlocked;
  saveState(state);
}

// ============================================================
// ACTIVITY LOG
// ============================================================
function addActivity(text) {
  const state = getState();
  if (!state) return;
  state.activity = [{ text, time: new Date().toISOString() }, ...(state.activity || [])].slice(0, 50);
  saveState(state);
}

// ============================================================
// STREAK
// ============================================================
function updateStreak() {
  const state = getState();
  if (!state) return;
  const char      = state.character;
  const today     = todayStr();
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const yStr      = yesterday.toISOString().split('T')[0];

  if (!char.lastLoginDate || char.lastLoginDate === today) {
    char.lastLoginDate = today;
    saveState(state);
    return;
  }
  if (char.lastLoginDate === yStr) {
    char.streak = (char.streak || 0) + 1;
    addActivity(`🔥 ${char.streak}-day streak!`);
  } else {
    char.streak = 1;
  }
  char.lastLoginDate = today;
  saveState(state);
  checkAchievements(getState());
}

// ============================================================
// UTILITY
// ============================================================
function todayStr() { return new Date().toISOString().split('T')[0]; }

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
}

function timeAgo(isoStr) {
  if (!isoStr) return '';
  const diff = (Date.now() - new Date(isoStr).getTime()) / 1000;
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

function countdown(isoDeadline) {
  const diff = new Date(isoDeadline).getTime() - Date.now();
  if (diff <= 0) return { text: 'EXPIRED', urgent: true };
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000)   / 1000);
  return { text: `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`, urgent: diff < 3600000 };
}

// ============================================================
// NAV INJECTION
// ============================================================
function injectNav() {
  const char = getCharacter();

  // Guard: if no active profile, redirect to login
  if (!getActiveProfileId() || !char) {
    if (!window.location.pathname.includes('index')) {
      window.location.href = 'index.html';
      return;
    }
    return;
  }

  const page     = window.location.pathname.split('/').pop() || 'dashboard.html';
  const navItems = [
    { href: 'dashboard.html',   icon: '🏠', label: 'Dashboard'   },
    { href: 'character.html',   icon: '⚔️', label: 'Character'   },
    { href: 'quests.html',      icon: '📋', label: 'Quests'       },
    { href: 'calendar.html',    icon: '📅', label: 'Calendar'     },
    { href: 'duel.html',        icon: '🤺', label: 'Duel Arena'   },
    { href: 'leaderboard.html', icon: '🏆', label: 'Leaderboard'  }
  ];

  const activeDuels = getDuels().filter(d => d.status === 'active').length;
  const emoji       = CLASSES[char.class]?.emoji || '?';
  const clsName     = CLASSES[char.class]?.name  || '';

  document.body.insertAdjacentHTML('afterbegin', `
    <nav class="sidebar" id="sidebar" aria-label="Main navigation">
      <div class="sidebar-logo">
        <h1>🌟 QuestRise</h1>
        <p>Life RPG Planner</p>
      </div>
      <ul class="sidebar-nav" role="list">
        ${navItems.map(item => `
          <li>
            <a href="${item.href}" id="nav-${item.label.toLowerCase().replace(' ','-')}"
               class="${page === item.href ? 'active' : ''}"
               aria-current="${page === item.href ? 'page' : 'false'}">
              <span class="nav-icon" aria-hidden="true">${item.icon}</span>
              ${item.label}
              ${item.href === 'duel.html' && activeDuels > 0 ? `<span class="notif-badge">${activeDuels}</span>` : ''}
            </a>
          </li>`).join('')}
      </ul>
      <div class="sidebar-player">
        <div class="player-avatar-sm" aria-hidden="true">${emoji}</div>
        <div style="flex:1;min-width:0;">
          <div class="player-name">${char.name}</div>
          <div class="player-class">Lv.${char.level} ${clsName}</div>
        </div>
        <button onclick="openProfileMenu()" title="Profile options"
          style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:1.1rem;padding:4px;"
          id="btn-profile-menu">⚙️</button>
      </div>
    </nav>
    <button class="mobile-toggle" id="mobile-toggle" onclick="toggleNav()" aria-label="Toggle menu">☰</button>
    <div class="mobile-overlay" id="mobile-overlay" onclick="toggleNav()"></div>
    <div class="toast-container" id="toast-container" aria-live="polite"></div>

    <!-- Profile Menu Modal -->
    <div class="modal-backdrop" id="profile-menu-modal">
      <div class="modal" style="max-width:380px;">
        <div class="modal-header">
          <div class="modal-title">⚙️ Profile Options</div>
          <button class="modal-close" onclick="closeProfileMenu()">✕</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <button class="btn btn-outline btn-block" onclick="exportSave()" id="btn-export-save">
            💾 Export Save File
          </button>
          <button class="btn btn-outline btn-block" onclick="logoutProfile()" id="btn-switch-profile">
            🔄 Switch Profile
          </button>
          <hr class="divider" />
          <p style="font-size:0.75rem;color:var(--text-muted);text-align:center;">
            Your data is saved automatically in your browser.<br>
            Export to keep a backup or transfer to another device.
          </p>
        </div>
      </div>
    </div>
  `);
}

function openProfileMenu() {
  document.getElementById('profile-menu-modal').classList.add('active');
}
function closeProfileMenu() {
  document.getElementById('profile-menu-modal').classList.remove('active');
}

function toggleNav() {
  document.getElementById('sidebar')?.classList.toggle('mobile-open');
  document.getElementById('mobile-overlay')?.classList.toggle('active');
}

// ============================================================
// UI HELPERS
// ============================================================
function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { success:'✅', error:'❌', warning:'⚠️', info:'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]||'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function showLevelUp(level) {
  const el = document.createElement('div');
  el.className = 'levelup-overlay';
  el.innerHTML = `
    <div class="levelup-content">
      <div class="levelup-ring"><div class="levelup-number">${level}</div></div>
      <div class="levelup-text">LEVEL UP!</div>
    </div>`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3600);
}

function renderStatBars(stats, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const order = ['str','int','agi','vit','cha','lck'];
  container.innerHTML = order.map(key => {
    const val  = stats[key] || 0;
    const info = STATS[key];
    const pct  = Math.min(100, (val / 120) * 100);
    return `
      <div class="stat-item stat-${key}">
        <div class="stat-header">
          <span class="stat-name">${info.short}</span>
          <span class="stat-value">${val}</span>
        </div>
        <div class="stat-bar">
          <div class="stat-bar-fill" style="width:0%" data-target="${pct}%"></div>
        </div>
      </div>`;
  }).join('');
  setTimeout(() => {
    container.querySelectorAll('.stat-bar-fill').forEach(b => { b.style.width = b.dataset.target; });
  }, 100);
}

function renderXPBar(char, containerId) {
  const container = document.getElementById(containerId);
  if (!container || !char) return;
  const pct = Math.round((char.xp / char.xpToNext) * 100);
  container.innerHTML = `
    <div class="xp-bar-labels">
      <span>Level ${char.level}</span>
      <span>${char.xp} / ${char.xpToNext} XP (${pct}%)</span>
      <span>Level ${char.level + 1}</span>
    </div>
    <div class="xp-bar-bg">
      <div class="xp-bar-fill" style="width:0%" id="xp-fill-bar"></div>
    </div>`;
  setTimeout(() => {
    const fill = document.getElementById('xp-fill-bar');
    if (fill) fill.style.width = pct + '%';
  }, 150);
}

// ============================================================
// INIT
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
  expireDuels();
  updateStreak();
  if (typeof initPage === 'function') initPage();
});
