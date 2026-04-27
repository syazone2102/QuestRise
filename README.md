# QuestRise — Life RPG Planner 🌟

A gamified life planner built with a DnD-style RPG system. Turn your daily tasks into quests, level up your character, and challenge rivals in the Duel Arena.

## ✨ Features

- **6 RPG Classes** — Warrior, Scholar, Merchant, Healer, Ranger, Mage — each with unique stat bonuses and skills
- **6 Core Stats** — STR, INT, AGI, VIT, CHA, LCK — grow by completing categorized tasks
- **Quest Planner** — Create tasks with categories, difficulties, deadlines, and recurring options
- **5-Minute Cooldown** — Anti-spam mechanic: quests must be at least 5 minutes old before completion
- **Progressive Leveling** — XP requirements scale steeply with each level (1.65× curve)
- **Calendar View** — Monthly grid with quest dots, day detail panel, and quick-add
- **Duel Arena** — Issue 48-hour async challenges to simulated opponents. Winners earn 1.5× XP
- **Leaderboard** — Hall of Legends with top-3 podium and class filtering
- **Profile / Save System** — Multiple save slots with optional PIN, export/import JSON save files

## 🚀 Getting Started

1. Clone or download this repository
2. Open `index.html` in your browser (or use Live Server in VS Code)
3. Create your hero and start your journey!

> **No backend required** — all data is saved in your browser's `localStorage`.

## 📁 File Structure

```
questrise/
├── index.html          # Landing page + profile selection + character creation
├── dashboard.html      # Main hub: stats, quests, duels, live clock
├── character.html      # Full character sheet: skills, achievements, duel record
├── quests.html         # Quest planner with cooldown system
├── calendar.html       # Monthly quest calendar
├── duel.html           # 48-hour async duel arena
├── leaderboard.html    # Hall of Legends rankings
├── css/
│   └── style.css       # Complete dark fantasy RPG design system
└── js/
    └── app.js          # Core game engine: XP, levels, quests, duels, profiles
```

## 🎮 How It Works

| Action | Reward |
|---|---|
| Complete a quest | +XP + stat point for matching category |
| Win a duel | +1.5× quest XP |
| Daily login | Streak bonus |
| Level up | Animated overlay + new title |

## 💾 Save System

- **Auto-save** — Data saved to browser localStorage automatically
- **Multiple profiles** — Create different heroes, each with their own save
- **PIN protection** — Optionally lock your profile with a PIN
- **Export/Import** — Download your save as a `.json` file and restore it anytime

## 🛠️ Tech Stack

- Pure HTML, CSS, JavaScript — no frameworks, no build step
- Google Fonts: Cinzel + Inter
- localStorage for persistence

---

*QuestRise — Rise through your quests, one day at a time.*
