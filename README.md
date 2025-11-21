# Dodge or Dare

A single-device, offline, pass-and-play party game where players must complete dares or dodge them for a penalty.

## Run Instructions

1.  This project is built with **React** and **TypeScript**.
2.  It is designed to be run in a browser environment that supports ES Modules or via a bundler like **Vite**.
3.  To run:
    *   Install dependencies (if using a package manager): `npm install`
    *   Start the dev server: `npm run dev`
    *   Or, if viewing in a standalone environment, open `index.html`.

## Offline Game Flow (Phase 1)

1.  **Setup:**
    *   The host enters the names of all players (physically present in a circle).
    *   Select the number of rounds and difficulty level.
    *   Start the game.

2.  **Gameplay Loop:**
    *   The device indicates whose turn it is.
    *   A **Dare** card is presented.
    *   **Option A: Do the Dare**
        *   Player attempts the dare.
        *   Group votes: "Success" (Next turn) or "Failed".
        *   If Failed: Player gets a **Forced Dodge**.
    *   **Option B: Dodge**
        *   Player loses **1 point**.
        *   Player draws a **Dodge** card and must complete the penalty task.
        *   Once confirmed, turn ends.

3.  **Game Over:**
    *   Game ends when all players have completed the set number of rounds.
    *   Scores are tallied (Points start at `Rounds`, -1 per Dodge).
    *   Winner(s) are displayed.

## Developer Log

## Update – 2025-05-21T14:00:00
**Action:** Project Initialization & Logic Refinement
**Files Modified:** game/gameLogic.ts, README.md
**Notes:**
- Implemented core game logic for Offline Mode (Pass-and-Play).
- Refactored `gameLogic.ts` to use immutable state updates for `players` array (replacing direct object mutation) to ensure reliable React re-renders.
- Verified UI flow against Phase 1 specifications:
  - Setup Screen (Dynamic player list).
  - Game Loop (Dare -> Resolution -> Dodge -> Turn Advance).
  - Game Over (Score calculation and routing).
- Added `README.md` with run instructions and architecture overview.

## Update – 2025-05-21T14:30:00
**Action:** Architecture Refactoring & Strict Feature Implementation
**Files Modified:** game/gameLogic.ts, components/ui/CardDisplay.tsx, components/ui/Button.tsx, components/ui/Scoreboard.tsx, components/screens/*
**Notes:**
- Enforced strict Phase 1 file structure by creating `src/components/ui/`.
- Moved `Button` and `Scoreboard` to `src/components/ui/`.
- Extracted `CardDisplay` component for better code reuse.
- Implemented missing specific game logic functions in `game/gameLogic.ts`:
  - `drawDareForCurrentPlayer`
  - `drawDodgeForCurrentPlayer`
- Updated `getRandomCard` logic to ensure Dodge cards ALWAYS draw from the full pool, ignoring the difficulty filter, as per rules.
- Updated all Screens to import components from new locations.

## Update – 2025-05-21T14:45:00
**Action:** Final Phase 1 Compliance Patch
**Files Modified:** index.html, main.tsx, game/gameLogic.ts, data/cards.ts, components/screens/OfflineGameScreen.tsx, README.md
**Notes:**
- Enforced `main.tsx` as the application entry point to strictly match Phase 1 architecture.
- Updated `index.html` to load `main.tsx` as a module.
- Verified and finalized `gameLogic.ts` to ensure all pure functions (createInitialGameState, playerChoosesDoDare, resolveDareResult, etc.) are fully implemented with immutable state updates.
- Confirmed `data/cards.ts` exports `DARE_CARDS` and `DODGE_CARDS` with correct typing.
- Hardened `OfflineGameScreen` against potential undefined player states during rapid phase transitions.
- Full Phase 1 feature set (Card Data, Project Structure, State Machine, Game Logic, Scoring, UI Flow) is now implemented.

## Update – 2025-05-21T16:00:00
**Action:** Phase 2 - Admin Panel & Data Persistence
**Files Modified:** index.html, main.tsx, game/types.ts, game/gameLogic.ts, services/adminDataService.ts, components/admin/*.tsx
**Notes:**
- Added `react-router-dom` to project for routing handling.
- Implemented `AdminDataService` to manage game data via `localStorage`. It seeds initial data from `data/cards.ts`.
- Updated `gameLogic.ts` to pull active cards dynamically from the admin service instead of static files.
- Created `/admin` route suite:
  - Protected routing with Login (`admin`/`dodge123`).
  - Dashboard for navigating managers.
  - **Dare Manager:** Create/Edit/Disable Dare cards.
  - **Dodge Manager:** Create/Edit/Disable Dodge cards.
  - **Difficulty Manager:** Manage presets (stubbed).
  - **Pattern Manager:** Create scriptable card patterns (stubbed).
- Configured `main.tsx` to separate Game App routing (`/*`) from Admin routing (`/admin/*`).

## Update – 2025-05-21T17:00:00
**Action:** Phase 2 Completion - Full Admin Panel Implementation
**Files Modified:** components/admin/DifficultyManager.tsx, components/admin/PatternManager.tsx, README.md
**Notes:**
- **Completed Difficulty Manager:** Full CRUD implementation with edit functionality, checkbox list for selecting allowed difficulties (EASY/MEDIUM/HARD), and comprehensive validation (empty name prevention, duplicate name detection, minimum one difficulty required).
- **Completed Pattern Manager:** Full CRUD implementation with edit functionality, player sequence management (add/remove sequences per player index), card ID selection from active Dare cards list, fallback mode dropdown (random/loop/stop), and validation (empty name prevention, duplicate name detection).
- **Admin Navigation:** Verified and confirmed AdminLayout includes complete navigation menu with links to all managers (Dares, Dodges, Difficulty, Patterns) and logout functionality.
- **Logout Functionality:** Confirmed logout button clears admin authentication state and redirects to login page.
- **Validation & Stability:** Added form validation across all admin managers to prevent empty submissions, duplicate names, and invalid states. UUID generation ensures no duplicate IDs.
- Phase 2 Admin Panel is now fully functional with complete CRUD operations for all data types (Dares, Dodges, Difficulty Presets, Card Patterns).

## Update – 2025-05-21T18:30:00
**Action:** Phase 3A – Scripted Patterns & Difficulty Presets Integration
**Files Modified:** game/types.ts, services/adminDataService.ts, components/admin/PatternManager.tsx, components/screens/OfflineSetupScreen.tsx, game/gameLogic.ts, App.tsx, README.md
**Notes:**
- Extended pattern data model with `PatternStep` entries (dare/dodge pairing) and backward-compatible storage via AdminDataService normalization/helpers.
- Rebuilt Pattern Manager UI for full step editing: per-player sequences, dare/dodge dropdowns, validation, and CRUD parity with the new model.
- Updated Offline Setup to load Difficulty Presets and Patterns from Admin tools, letting hosts choose presets/patterns alongside traditional difficulty/round settings.
- Expanded `GameSettings`/`GameState` plus game logic to track active pattern/preset data, route scripted dares/dodges, honor fallback modes, and drive pattern progress immutably within the turn lifecycle.
- Random dare selection now respects preset difficulty filters (with safe fallbacks), while scripted dodges override random draws when configured.
- Verified scenarios: scripted players with/without dodge steps, mixed random players, and each fallback mode (`random`, `loop`, `stop`) to ensure rules from Phase 1 remain intact.

## Update – 2025-05-21T19:30:00
**Action:** Phase 3A Follow-up – Per-Player Pattern Assignments
**Files Modified:** game/types.ts, services/adminDataService.ts, components/admin/PatternManager.tsx, components/screens/OfflineSetupScreen.tsx, game/gameLogic.ts, README.md
**Notes:**
- Refactored `CardPattern` into a single ordered sequence (`steps`) with `fallbackMode`, simplified AdminDataService storage, and added safe normalization for any legacy `playerSequences` data encountered during development.
- Rebuilt the Pattern Manager UI around the new model: hosts can now script one ordered list of dare/dodge steps, reorder entries, and manage per-step dare/dodge pairs with full validation.
- Offline Setup captures pattern assignments per player, letting hosts mix scripted and random players in the same game; these assignments are persisted into `GameSettings.playerPatternAssignments`.
- Game state & logic now track step progress per player, apply scripted dares/dodges only to the assigned player, honor fallback behavior (`random`, `loop`, `stop`), and leave all Phase 1 scoring/dodge rules untouched.
- Tested a table where Player 1 and Player 4 follow different patterns (with and without scripted dodges) while others remain random, confirming each player walks their sequence in order and falls back correctly once their script ends.