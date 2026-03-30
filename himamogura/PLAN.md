# Himamogura — Implementation Plan

## Phase 1: Core Bot & Database
- Discord.js bot setup with slash command registration
- SQLite database schema (users, hobbies, user_hobbies, challenges)
- Mole mascot ASCII art and personality system
- Hobby data seeding (100+ hobbies across categories)

## Phase 2: Hobby Discovery Commands
- /dig — Random hobby suggestion with meme-style mole commentary
- /quiz — Interactive personality quiz (5 questions) → matched hobbies
- /collection — View tried hobbies with ratings
- /rate — Rate a hobby you've tried (1-5 stars)

## Phase 3: Daily Challenges & Gamification
- /challenge — Daily hobby challenge with streak tracking
- /stats — Personal stats (hobbies tried, streak, favorites)
- /ranking — Server leaderboard by hobbies collected
- Streak rewards and milestone messages

## Phase 4: Polish & Testing
- Mole personality variations (encouraging, sarcastic, excited)
- Rich embeds with color coding per hobby category
- Error handling and edge cases
- Test suite
