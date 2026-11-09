import React from 'react';

//Maps numercal ranks to card letters
const RANK_MAP = {1: 'A', 11: 'J', 12: 'Q', 13: 'K'};
//Maps suit names to symbols
const SUIT_SYMBOLS = {hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠'};

//Function component that accepts a card object and renders empty, face-down, or face-up designs
export default function Card({card, onClick, isSelected = false}) {
    //Renders empty card slot if card object is null
    if (!card) {
        return <div className="card empty-slot" />;
    }

    //Renders face-down card and retains click handler stock flip events
    if(!card.faceUp) {
        return <div className="card card-back" onClick = {onClick}/>;
    }

//Determines CSS class names for each section
let cardClassName = "card card-front";
if(isSelected) {
  cardClassName = "card card-front selected";
}

//Normalizes suit string to lowercase to be consistent with deck.js
const normalizedSuit = card.suit ? card.suit.toLowerCase(): '';

//Determines color based off above suit
let colorClass = 'black';
if (normalizedSuit === 'hearts' || normalizedSuit === 'diamonds') {
    colorClass = 'red';
}

//Constant that converts numerical rank to the numbers using RANK_MAP
const rankLabel = RANK_MAP[card.rank] || card.value || card.rank;
//Constant that converts suit name to symbol using SUIT_SYMBOLS
const suitSymbol = SUIT_SYMBOLS[normalizedSuit] || '';

//Renders face-up card with correct color/suit characteristics to the screen
return (
        <div className={`${cardClassName} ${colorClass}`} onClick={onClick}>
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
