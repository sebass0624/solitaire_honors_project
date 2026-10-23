//Creates function for when drawing from the stock pile into the wastepile
export function drawFromStock(state) {
    //Checks if stock is empty and returns state unchanged
    if (!state.stock || state.stock.length === 0) {
        return state; }

    //Makes copies of stock and waste piles to prevent overwriting
    const newStock = [...state.stock];
    const newWaste = [...state.waste];

    //Draws top card from the stock pile
    const card = newStock.pop();
    //Flips the card up and adds to waste when not used
    card.faceUp = true;
    newWaste.push(card);

    //Returns new state
    return {
        ...state,
        stock: newStock, 
        waste: newWaste,
    };
}

//Creates function for when stock pile is completely gone through and to flip back to the beginning of the pile (recycling)
export function resetStock(state) {
    //Reverses the stock pile when no cards are left and there is at least one waste card
    if (state.stock.length === 0 && state.waste.length > 0) {
        const newStock = state.waste
        .map((card) => ({ ...card, faceUp: false }))
        .reverse();

    //Empties the waste pile
    const newWaste = [];

    //Returns new state
    return {
        ...state, 
        stock: newStock, 
        waste: newWaste,
            };
    }
    //Returns current state if these conditions aren't met
    return state; 
}

//Creates functions that validates whether or not a card can be moved to foundation pile
export function canMoveToFoundation(card, foundationPile) {
    //Ensures card is available for moving
    if(!card) {
        return false; 
    }
    //Ensures that if the current foundation pile has no cards, only an Ace can be placed down
    if (foundationPile.length === 0) {
        return card.rank === 1; 
    }
    //Otherwise, it is ensured that the foundation card and top card's suit is identical/in descending order
    else {
        const topCard = foundationPile[foundationPile.length - 1];
        return card.suit === topCard.suit && card.rank === topCard.rank + 1;
    }
}

//Creates funtion that can move cards to the tableau
export function canMoveToTableau(movingCards, targetColumn) {
    //Checks if there are moving cards available/more than 1
    if (!movingCards || movingCards.length === 0) {
        return false; }
        const leadCard = movingCards[0];
    
    //If no cards present, only placeable card down is King
    if (targetColumn.length === 0) {
        return leadCard.rank === 13;
    }

    //Pulls last card from deck
    const topCard = targetColumn[targetColumn.length - 1];
    //Ensures that the cards are in opposite colo (8 RED 7 BLACK 6 RED, etc)
    const isOppositeColor = leadCard.color !== topCard.color;
    //Ensures that the cards can be placed in the tableau ONLY in descending order
    const isOneRankLower = leadCard.rank === topCard.rank - 1;
    //Returns values of above variables as true
    return isOppositeColor && isOneRankLower;
}
