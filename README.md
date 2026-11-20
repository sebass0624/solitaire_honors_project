<<<<<<< HEAD
=======
# Solitaire

A full-stack Solitaire web application built using Next.js and MySQL. Features complete gameplay, move/time tracking, scorekeeping, a bouncing-card win animation, and a persistent Top 10 leaderboard.

# Live Demo
Try the app here: https://solitaire-honors-project.vercel.app/

## Features

- **Standard Gameplay:** Full 52-card deck initialization, stock/waste drawing and recycling, 7 tableau columns, and 4 suit foundation piles.
- **Card Interaction:** Click-to-move selection, automatic foundation/tableau moves on single click, and multi-card stack transfers.
- **Undo System:** Full state history allowing players to step back through previous moves.
- **Klondike Scoring Engine:**
  - Move card to Foundation: **+10 points**
  - Move card from Waste to Tableau: **+5 points**
  - Flip a face-down Tableau card: **+5 points**
  - Move card from Foundation back to Tableau: **-15 points**
  - Recycle Waste back to Stock (after the first pass): **-100 points** (score floors at `0`)
- **Persistent Cloud Leaderboard:** Displays the top 10 scores ranked by highest score, fewest moves, and fastest completion time, backed by **Aiven MySQL**.
                                                                                        
## Database Structure

```sql
CREATE TABLE IF NOT EXISTS leaderboard (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_name VARCHAR(50) NOT NULL,
  score INT NOT NULL DEFAULT 0,
  moves INT NOT NULL,
  time_seconds INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Project Directory

```text
solitaire_honors_project/
├── app/
│   ├── api/
│   │   └── games/
│   │       └── leaderboard/
│   │           └── route.js - Exposes GET (fetch top 10 scores) and POST (validate and insert new score entries) endpoints
│   ├── globals.css - Controls base colors and styling throughout the app
│   ├── layout.js - Defines root HTML document structure and stylesheet imports
│   ├── page.js - Manages game state, acts as game controller, controls displays, and renders all overlays
│   └── page.module.css - Provides styling for main game view and containers
├── components/
│   ├── Board.jsx - Renders suits and card groups (organizes stock, waste, tableau, and foundation piles into sections)
│   ├── Card.jsx - Renders individual playing cards with suit symbols, ranks, and configured click interactions
│   ├── leaderboard.js - Fetches and renders the top 10 leaderboard table
│   ├── Pile.jsx - Renders individual card piles (stock, waste, foundation) and handles empty-slot targeting
│   ├── TableauColumn.jsx - Displays the seven tableau columns in a cascading layout with face-up and face-down cards
│   ├── WinCascade.js - Renders full-screen bouncing-card canvas animation upon game win
│   └── WinScreen.js - Displays victory modal with score, time, and name submission form upon game win
├── lib/
│   ├── db.js - Exports MySQL connection pool using environment variables from `.env`
│   └── solitaire/
│       ├── rules.js - Enforces movement rules, win detection, and score calculations across piles
│       └── state.js - Initializes and shuffles 52-card deck, deals cards, tracks moves/score, and manages undo history
├── .env.example - Provides template of required database connection environment variables for local setup
└── package.json - Lists installed project dependencies and npm scripts
```

## Acknowledgments

- **Win Cascade Animation (`components/WinCascade.js`):** The Canvas trail-rendering technique and 2D gravity/bounce physics loop were adapted from standard JavaScript/Canvas Solitaire cascade examples and AI-assisted code generation, then I integrated it myself into the React lifecycle and layered with the `WinScreen` modal.
>>>>>>> 49b5f95843ef0a81933f5848f233d8b8c2f430e7
