import React from 'react';

//Maps numercal ranks to card letters
const RANK_MAP = {1: 'A', 11: 'J', 12: 'Q', 13: 'K'};
//Maps suit names to symbols
const SUIT_SYMBOLS = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };

//Creates function that accepts card object to ensure 
//card object isn't null or flipped over, rendering empty/flipped design respectively
export default function Card({card}) {
    if (!card ) {
        return <div className="card empty-slot" />;
    }

    if(!card.faceUp) {
        return <div className="card card-back" />;
    }

//Constant that convert numerical rank to the numbers using RANK_MAP
const rankLabel = RANK_MAP[card.rank] || card.rank;
//Constant that converts suit name to symbol using SUIT_SYMBOLS
const suitSymbol = SUIT_SYMBOLS[card.suit];

//Renders face-up card with correct color/suit characteristics to the screen
return (
    <div className={`card ${card.color}`}>
      <span className="card-corner top-left">
        {rankLabel}{suitSymbol}
      </span>
      <span className="card-center">
        {suitSymbol}
      </span>
      <span className="card-corner bottom-right">
       {rankLabel}{suitSymbol}
      </span>
    </div>
  );
}
