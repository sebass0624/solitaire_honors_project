//Imports createDeck/shuffleDeck functions from deck.js to construct and shuffle/distribute 52-card deck into proper game piles
import {createDeck, shuffleDeck} from './deck.js';

//Starts game instance and returns new Solitaire game object
//Function distributes 28 cards into the seven tableau columns, leaving top-card face-up
//Places other 24 cards into stock pile
export function InitializeGame() {
  //Generates and shuffles deck of52 cards
  const deck = shuffleDeck(createDeck());
  //Initalizes 7 empty columns for the tableau section 
  const tableau = [[], [], [], [], [], [], []];
  //Distributes 28 non-stock cards across the 7 tableau piles (1-7 respectively)
  for (let col = 0; col < 7; col++) {
    for (let cardNum = 0; cardNum < col + 1; cardNum++) {
      const card = deck.pop();

      //Ensures that top-most card on each column is turned face-up
      if (cardNum === col) {
        card.faceUp = true;
      } else {
        card.faceUp = false;
      }
      tableau[col].push(card);
    }
  }

  // Retrieves the remaining cards and assigns them to the stock pile from deck, face down
  const stock = deck.map((card) => ({
    ...card,
    faceUp: false,
  }));

  //Returns master game object (defines structure)
  return {
    tableau, //Array of seven columns on the top containing all pre-dealt cars
    stock, //Remaining 24 cards for card drawing
    waste: [], //Initially empty pile for drawn stock cards 
    foundation: { hearts: [], diamonds: [], clubs: [], spades: [] }, //Object that maps each suit to an empty array for scoring piles
    moves: 0, //Valid move counter, starting at 0
    timer: 0, //Elapsed time duration of game session, starting at 0
    isWon: false, //Flag that checks whether or not win conditions are satisfied
  };
}

