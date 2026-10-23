//Defines all four possible suits
const suits = ["hearts", "diamonds", "clubs", "spades"];
//Defines all thirteen possible values
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

//Generates full 52 card Solitaire deck
export function createDeck() {
  //Empty array to hold the deck
  const deck = [];
  //For loop to iterate through every suit (4 times)
  for (let suit of suits) {
    //For loop to iterate through every value (13 times)
    for (let value of values) {
      //Determines card color based off type of suit
      let color;
      if (suit === "hearts" || suit === "diamonds") {
        color = "red";
      } else {
        color = "black";
      }

      //Converts rank string of card into number for move logic
      const numericValue = values.indexOf(value) + 1;

      //Creates the card object, initiating necessary properties
      const card = {
        id: `${suit}-${value}`,
        suit: suit,
        value: value,
        numericValue: numericValue,
        color: color,
        faceUp: false,
      };

      //Adds new card to deck
      deck.push(card);
    }
  }
  
  //Returns all 52 cards
  return deck;
}

//Function used to shuffle deck
export function shuffleDeck(deck) {
    //Uses spread to make a copy of initial deck
    const shuffled = [...deck];

    //Iterates backward from the last element all the way to the beginning via Fisher-Yates Shuffle algorithm
    for (let i = shuffled.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    //Returns shuffled product
    return shuffled;
}