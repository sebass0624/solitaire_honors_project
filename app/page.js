//Makes next.js run this as interactive
'use client';

import React, {useState, useEffect} from 'react';
import Board from '../components/Board.jsx';
import {createInitialState} from '../lib/solitaire/state.js';
import {drawFromStock, moveToFoundation, moveToTableau} from '@/lib/solitaire/rules.js';

//Creates function to initailize game engine 
export default function SolitairePage() {
    //Declares variable to hold game board
    const [gameState, setGameState] = useState(null);
    //Declares state to track currently selected card
    const [selectedCard, setSelectedCard] = useState(null);

    //Initalizes gameboard when component successfully mounts on to screen
    useEffect(() => {
    const newGame = createInitialState();
    setGameState(newGame);
  }, []);

    //Helper function for clicking the stock pile
    const handleStockClick = () => {
      if(gameState) {
        //Clears the desired section when drawing a new card
        setSelectedCard(null);
        const updatedState = drawFromStock(gameState);
        setGameState(updatedState);
      }
    };
    
    //Helper function for selecting the card and choosing its location
    const handleCardClick = (targetCard, source, colIndex, cardIndex) => {
      //Case 1: No card selected yet -> select card if its faceup
      if(!selectedCard) {
        if(targetCard && targetCard.faceUp) {
          setSelectedCard({targetCard, source, colIndex, cardIndex});
        }
      }
      //Case 2: Clicking exact card -> deselect it
      else if(selectedCard.card === targetCard) {
        setSelectedCard(null);
      }

      //Case 3: Card already selected -> try to move it to desired tableau
      else {
        let updatedState = null;

        if(source === 'tableau') {
          updatedState = moveToTableau(gameState, selectedCard, colIndex);
        }

        else if (source === 'foundation') {
          updatedState = moveToFoundation(gameState, selectedCard, colIndex);
        }

        if (updatedState) {
            setGameState(updatedState);
            setSelectedCard(null);
        }

        //If game engine allowed the move
        else {
          if(targetCard && targetCard.faceUp) {
            setSelectedCard({card: targetCard, source, colIndex, cardIndex});
          }
          else {
            setSelectedCard(null);
          }

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
    else {
      return (
        <main className="solitaire-container">
          <Board gameState = {gameState} 
                 onStockClick = {handleStockClick}
                 onCardClick = {handleCardClick}
                 selectedCard = {selectedCard}/>
        </main>
      );
    }
}

