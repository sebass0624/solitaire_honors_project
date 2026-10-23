//Imports createDeck/shuffleDeck functions from deck.js
import {createDeck, shuffleDeck} from './deck.js';

//Creates function to shuffle the created deck and initalize the tableau
export function InitalizeGame {
    const deck = shuffleDeck(createDeck());
    const tableau = [[], [], [], [], [], [], []];
}

//For loop used to sort through the tableau and finetune its pattern/ensure the front card is faced up in the pile (28 cards)
for (let col = 0; col < 7; col++) {
    for (let cardNum = 0; cardNum < col + 1; cardNum++) {
        const card = deck.pop();
        if (cardNum === col) {
            card.faceUp = true; }
        else {
            card.faceUp = false; }
        tableau[col].push(card);
    }
} 

//Retrives the remaining 24 cards from deck are faced down on side
const stock = deck.map((card) => ({
  ...card,
  faceUp: false,
}));

//Creates arrays for the waste/suit piles
const waste = [];
const foudation = [[], [], [], []];

//Returns the state
return {
    tableau, 
    stock,
    waste,
    foundation,
};