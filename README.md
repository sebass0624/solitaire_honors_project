# Solitaire

A full-stack Solitaire web application built using Next.js and MySQL. Features complete gameplay, move/time tracking, scorekeeping, and more. Animation and leaderboard are implemented as well.

## Project Structure

solitaire_honors_project/
├── app/
│   ├── api/
│   │   └── games/
│   │       └── leaderboard/
│   │           └── route.js - CONTAINS GET METHOD (responsible for exposing leaderboard API) AND POST METHOD (validates and inserts new metadata entries along with API endpoints) 
│   ├── globals.css - Controls base colors and styling throughout the app
│   ├── layout.js - Defines root HTML document structure and stylesheet imports
│   ├── page.js - Manages game state, acts as game controller, controls displays, and renders all overlays
│   └── page.module.css - Provides styling for main game view and containers
├── components/
│   ├── Board.jsx - Renders suits and card groups (organizes stock, waste, tableau, and foundation piles into sections)
│   ├── Card.jsx - Renders individual playing cards with suit symbols, ranks, and configured click interactions
│   ├── leaderboard.js - Fetches and renders top 10 leaderboard table (updates upon refresh)
│   ├── Pile.jsx - Renders individual card piles (stock, waste, foundation) and handles empty-slot targeting
│   ├── TableauColumn.jsx - Displays the center seven rows of cards in a cascading fashion, with necessary face-up and face-down attributes where required
│   ├── WinCascade.js - Renders full-screen animation upon game win 
│   └── WinScreen.js - Displays victory message along with score and time upon game win
├── lib/
│   ├── db.js - Exports MySQL connection pool using environmental variables from '.env' file
│   └── solitaire/ 
│       ├── rules.js - Enforces movement rules for cards amongst the different piles
│       └── state.js - Initializes and shuffles 52-card deck, deals cards, tracks moves, and more
├── .env.example - Provides template of required database connection environment for local setup
└── package.json - Lists correctly installed project dependencies

## Getting Started
1. Node.js, MYSQLServer required

2. Create database with following setup and run code once:

CREATE DATABASE IF NOT EXISTS solitaire_db;
USE solitaire_db;

CREATE TABLE IF NOT EXISTS leaderboard (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_name VARCHAR(50) NOT NULL,
  score INT NOT NULL DEFAULT 0,
  moves INT NOT NULL,
  time_seconds INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

3. Create a .env.local file in the project root with your MySQL credentials:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=solitaire_db

4. Run 'npm install' and 'npm run dev'

5. Play at http://localhost:3000
