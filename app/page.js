//Makes next.js run this as interactive
'use client';

//Importing react and other necessary components to allow game to run
import React, {useState, useEffect} from 'react';
import Board from '../components/Board';
import Leaderboard from '@/components/leaderboard';
import {InitializeGame as createInitialState} from '../lib/solitaire/state.js';
import {drawFromStock, moveToFoundation, moveToTableau} from '@/lib/solitaire/rules.js';
import WinScreen from '@/components/WinScreen';

//Creates function that manages game loop state, selection, routing, and win screen
export default function SolitairePage() {
    //Game engine state variable
    const [gameState, setGameState] = useState(null);
    //Declares state to track currently selected card with all necessary card parameters
    const [selectedCard, setSelectedCard] = useState(null);
    //Variable trigger that refetches leaderboard entries when a player wins
    const [refreshLeaderboard, setRefreshLeaderboard] = useState(0);

    //Initalizes deck state when component successfully mounts (game starts)
    useEffect(() => {
      const newGame = createInitialState();
      setGameState(newGame);
    }, []);

    //Helper function called when score submission to leaderboard succeeds
    const handleScoreSubmitted = () => {
      setGameState((prev) => (prev ? {...prev, isWon: false, isGameWon: false} : prev));
      setRefreshLeaderboard((prev) => prev + 1);
    }

    //Helper function to restart the game if no valid moves are left
    const handleNewGame = () => {
      setSelectedCard(null);
      setGameState(createInitialState());
    }

    //Helper function for clicking the stock pile
    const handleStockClick = () => {
      if(gameState) {
        //Clears the selected section when drawing a new card
        setSelectedCard(null);
        const updatedState = drawFromStock(gameState);
        setGameState(updatedState);
      }
    };
    
    //Helper function for selecting the card and choosing its location
    const handleCardClick = (targetCard, source, colIndexOrSuit, cardIndex) => {
      //Case 1: No card selected yet -> select card if its faceup
      if (!selectedCard) {
            if (targetCard && targetCard.faceUp) {
                setSelectedCard({
                    card: targetCard,
                    source,
                    colIndex: typeof colIndexOrSuit === 'number' ? colIndexOrSuit : undefined,
                    suit: typeof colIndexOrSuit === 'string' ? colIndexOrSuit : undefined,
                    cardIndex
                });
            }
            return;
        }

      //Case 2: Clicking exact card -> deselect it
      if(selectedCard.card?.id === targetCard?.id || selectedCard.card === targetCard) {
        setSelectedCard(null);
        return;
      }

      //Case 3: Card already selected -> try to move it to desired tableau
      let updatedState = null;

      if(source === 'tableau') {
         updatedState = moveToTableau(gameState, selectedCard, colIndexOrSuit);
      }
        
      else if (source === 'foundation') {
        updatedState = moveToFoundation(gameState, selectedCard, colIndexOrSuit);
      }

      //If move is considered valid by rules.js file
      if (updatedState) {
          setGameState(updatedState);
          setSelectedCard(null);
      }
      
      //If move failed, switch selection to clicked target if it is face-up
      else {
        if(targetCard && targetCard.faceUp) {
          setSelectedCard({
            card: targetCard,
            source,
            colIndex: typeof colIndexOrSuit === 'number' ? colIndexOrSuit: undefined,
            suit: typeof colIndexOrSuit === 'string' ? colIndexOrSuit: undefined,
            cardIndex
          });
        }
        else {
           setSelectedCard(null);
        }
      }
    };

    //Checks if game has fully loaded in or not and initalizes it
    if(!gameState) {
      return (
        <main className="solitaire-container">
          <div className="loading">Initializing Solitaire Deck...</div>
        </main>
      );
    }

    return (
      <main className="solitaire-container">
        {/*New Game Button*/}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
          <h1 style={{margin: 0, fontSize: '1.5rem'}}>Solitaire</h1>
          <button
            onClick={handleNewGame}
            style={{padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#2e7d32', color: '#fff', cursor: 'pointer', fontWeight: 'bold'}}
          >
            New Game
          </button>
        </div>
        {/*Existing Board Controls*/}
        <Board
          gameState={gameState}
          onStockClick={handleStockClick}
          onCardClick={handleCardClick}
          selectedCard={selectedCard}
      />

      {/*Scores Leaderboard*/}
      <Leaderboard refreshKey={refreshLeaderboard} />
    
      {/*Win Screen*/}
      <WinScreen
        moves={gameState.moves || 0}
        timeSeconds={gameState.timer || gameState.timeSeconds || 0}
        isOpen={Boolean(gameState.isWon || gameState.isGameWon)}
        onSubmitSuccess={handleScoreSubmitted}
      />
    </main>
  );
}


