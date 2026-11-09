//Imports createDeck/shuffleDeck functions from deck.js
import {createDeck, shuffleDeck} from './deck.js';

//Creates function to shuffle the created deck and initalize the tableau
export function InitalizeGame() {
  const deck = shuffleDeck(createDeck());
  const tableau = [[], [], [], [], [], [], []];

  for (let col = 0; col < 7; col++) {
    for (let cardNum = 0; cardNum < col + 1; cardNum++) {
      const card = deck.pop();

      if (cardNum === col) {
        card.faceUp = true;
      } else {
        card.faceUp = false;
      }
      tableau[col].push(card);
    }
  }

  // Retrieves the remaining cards from deck as face down stock
  const stock = deck.map((card) => ({
    ...card,
    faceUp: false,
  }));

  return {
    tableau,
    stock,
    waste: [],
    foundation: { hearts: [], diamonds: [], clubs: [], spades: [] },
    moves: 0,
    timer: 0,
    isWon: false,
  };
}
